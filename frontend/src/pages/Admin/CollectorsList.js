import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import { usePDF } from 'react-to-pdf';

const CollectorsList = () => {
  const [collectors, setCollectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: 'firstname', direction: 'asc' });
  const recordsPerPage = 5;
  const { toPDF, targetRef } = usePDF({ 
    filename: 'collectors-list.pdf',
    page: { format: 'a4', orientation: 'landscape' }
  });

  useEffect(() => {
    const fetchCollectors = async () => {
      try {
        const data = await adminService.getCollectors();
        // Ensure we have all required fields
        const formattedData = data.map(collector => ({
          firstname: collector.firstName || '',
          lastname: collector.lastName || '',
          email: collector.email || '',
          location: collector.location || 'N/A'
        }));
        setCollectors(formattedData);
      } catch (error) {
        setError('Failed to fetch collectors');
        console.error('Error fetching collectors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollectors();
  }, []);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedCollectors = [...collectors].sort((a, b) => {
    const aValue = a[sortConfig.key]?.toLowerCase() || '';
    const bValue = b[sortConfig.key]?.toLowerCase() || '';
    return sortConfig.direction === 'asc' 
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue);
  });

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = sortedCollectors.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(collectors.length / recordsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    toPDF();
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-brown">Collectors</h1>
        <div className="flex gap-4">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-brown text-cream rounded hover:bg-brown/80 transition-colors"
          >
            Print List
          </button>
          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2 bg-brown text-cream rounded hover:bg-brown/80 transition-colors"
          >
            Download PDF
          </button>
        </div>
      </div>
      
      {/* Display table with pagination */}
      <div className="bg-cream rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="bg-brown text-cream">
              <th 
                className="px-6 py-3 text-left cursor-pointer hover:bg-brown/80"
                onClick={() => handleSort('firstname')}
              >
                First Name {sortConfig.key === 'firstname' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="px-6 py-3 text-left cursor-pointer hover:bg-brown/80"
                onClick={() => handleSort('lastname')}
              >
                Last Name {sortConfig.key === 'lastname' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="px-6 py-3 text-left cursor-pointer hover:bg-brown/80"
                onClick={() => handleSort('email')}
              >
                Email {sortConfig.key === 'email' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="px-6 py-3 text-left cursor-pointer hover:bg-brown/80"
                onClick={() => handleSort('location')}
              >
                Location {sortConfig.key === 'location' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((collector, index) => (
              <tr key={index} className="border-b border-brown/10">
                <td className="px-6 py-4">{collector.firstname}</td>
                <td className="px-6 py-4">{collector.lastname}</td>
                <td className="px-6 py-4">{collector.email}</td>
                <td className="px-6 py-4">{collector.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-2 print:hidden">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-brown text-cream rounded disabled:opacity-50"
        >
          Previous
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`px-4 py-2 rounded ${
              currentPage === index + 1
                ? 'bg-brown text-cream'
                : 'bg-cream text-brown hover:bg-brown/10'
            }`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-brown text-cream rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Hidden table for PDF download - contains all records */}
      <div ref={targetRef} className="hidden">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-brown mb-4">Complete Collectors List</h2>
          <table className="min-w-full">
            <thead>
              <tr className="bg-brown text-cream">
                <th className="px-6 py-3 text-left">First Name</th>
                <th className="px-6 py-3 text-left">Last Name</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Location</th>
              </tr>
            </thead>
            <tbody>
              {sortedCollectors.map((collector, index) => (
                <tr key={index} className="border-b border-brown/10">
                  <td className="px-6 py-4">{collector.firstname}</td>
                  <td className="px-6 py-4">{collector.lastname}</td>
                  <td className="px-6 py-4">{collector.email}</td>
                  <td className="px-6 py-4">{collector.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .container, .container * {
            visibility: visible;
          }
          .container {
            position: absolute;
            left: 0;
            top: 0;
          }
          .print\\:hidden {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default CollectorsList; 