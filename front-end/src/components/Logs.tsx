import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';
import Select from 'react-select';
import '../styles/Logs.css'

type LogsProps = {
  handleLogout: () => void;
  isAdmin: boolean;
};

type LogData = {
  category: string;
  data: any;
};

const Logs: React.FC<LogsProps> = ({ handleLogout, isAdmin }) => {
  const [logs, setLogs] = useState<LogData[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOptions, setFilterOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [selectedFilter, setSelectedFilter] = useState('');

  useEffect(() => {
    const socket: Socket = io('http://localhost:3000'); // Connect to the Socket.IO server

    const fetchLogs = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/data');
        setLogs(response.data);
        setFilteredLogs(response.data);
        const uniqueCategories = getUniqueCategories(response.data);
        const options = uniqueCategories.map((category) => ({
          value: category,
          label: category,
        }));
        setFilterOptions(options);
      } catch (error) {
        console.error(error);
      }
    };

    fetchLogs();

    // Listen for the 'logsUpdated' event and fetch logs when it is received
    socket.on('logsUpdated', fetchLogs);

    // Disconnect the socket when the component is unmounted
    return () => {
      socket.disconnect();
    };
  }, []);

  const getUniqueCategories = (logs: LogData[]): string[] => {
    const uniqueCategories = Array.from(
      new Set(logs.map((log) => log.category))
    );
    return uniqueCategories;
  };

  const handleFilterChange = (selectedOption: any) => {
    setSelectedFilter(selectedOption.value);
  };

  // map filterOptions to be an array of objects with label and value properties
  // this format is required by react-select
  const selectOptions = [
    { value: '', label: 'All logs' },
    ...filterOptions.map((filter) => ({
      value: filter.value,
      label: filter.label,
    })),
  ];


  useEffect(() => {
    const filtered = logs.filter((log) => {
      // If a category is selected, only search within that category
      const isCategoryMatch =
        selectedFilter !== '' ? selectedFilter === log.category : true;

      // Check if log data (converted to a string) includes the search term
      // Also check if category includes the search term when no category filter is applied
      const isSearchMatch =
        selectedFilter.length > 0
          ? JSON.stringify(log.data)
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
          : (
            JSON.stringify(log.data).toLowerCase() +
            log.category.toLowerCase()
          ).includes(searchTerm.toLowerCase());

      return isCategoryMatch && isSearchMatch;
    });
    setFilteredLogs(filtered);
  }, [logs, searchTerm, selectedFilter]);

  return (
    <div className="container">
      <div className="search-and-filter">
        <input
          type="text"
          placeholder={selectedFilter ? `Search within ${selectedFilter}...` : 'Search categories or data...'}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
        <div className="filter">
          <span>Filter:</span>
          <Select
            options={selectOptions}
            value={selectOptions.find(option => option.value === selectedFilter)}
            onChange={handleFilterChange}
          />
        </div>
      </div>
      <div className="logs">
        {filteredLogs.length === 0 ? (
          <p>No logs found.</p>
        ) : (
          filteredLogs.map((log, index) => (
            <div key={index} className="log">
              <h3>{log.category}</h3>
              {Array.isArray(log.data) ? (
                <ul>
                  {log.data.map((item: any, itemIndex: number) => (
                    <li key={itemIndex}>{JSON.stringify(item)}</li>
                  ))}
                </ul>
              ) : (
                <p>{JSON.stringify(log.data)}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Logs;