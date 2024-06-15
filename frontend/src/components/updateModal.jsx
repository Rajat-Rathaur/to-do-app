// EditTaskModal.jsx
import React, { useState, useEffect } from 'react';

const EditTaskModal = ({ isOpen, onClose, itineraryToEdit }) => {
    const [itineraryData, setItineraryData] = useState({
        title: '',
        startDate: '',
        endDate: '',
        description: '',
        completed: '',
      });
    
      useEffect(() => {
        if (itineraryToEdit) {
          setItineraryData({
            title: itineraryToEdit.title,
            startDate: itineraryToEdit.startDate,
            endDate: itineraryToEdit.endDate,
            description: itineraryToEdit.description,
            completed: itineraryToEdit.completed,
          });
        }
      }, [itineraryToEdit]);
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setItineraryData((prevState) => ({
          ...prevState,
          [name]: value,
        }));
      };
      
      
      const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
          const userDetails = JSON.parse(localStorage.getItem('user'));
          if (!userDetails || !userDetails.id) {
            throw new Error('User ID not found in userDetails');
          }
    
          const userId = userDetails.id;
          const response = await fetch(`http://localhost:5000/users/updateItinerary/${itineraryToEdit._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...itineraryData,
              user: userId,
            }),
          });
    
          if (response.ok) {
            console.log('Itinerary updated successfully');
            onClose(); // Close the modal after successful update
            // Optionally, you can reload the itinerary list or update the itinerary in the state
            window.location.reload();
          } else {
            console.error('Failed to update itinerary');
          }
        } catch (error) {
          console.error('Error:', error);
        }
      };

  return isOpen ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-gray-300 rounded-lg shadow-lg p-6 w-3/4 h-3/4 overflow-auto">
        <h2 className="text-xl font-bold mb-4">Edit Task</h2>
        <form onSubmit={handleSubmit}>
        <div className="mb-4">
      <label htmlFor="title" className="block font-medium mb-2">
        Title
      </label>
      <input
        type="text"
        id="title"
        name="title"
        value={itineraryData.title}
        onChange={handleChange}
        className="border border-gray-300 rounded-md px-3 py-2 w-full"
      />
    </div>
    <div className="mb-4 flex">
      <div className="mr-4">
        <label htmlFor="startDate" className="block font-medium mb-2">
          Start Date
        </label>
        <input
          type="date"
          id="startDate"
          name="startDate"
          value={itineraryData.startDate}
          onChange={handleChange}
          className="border border-gray-300 rounded-md px-3 py-2 w-full"
        />
      </div>
      <div>
        <label htmlFor="endDate" className="block font-medium mb-2">
          End Date
        </label>
        <input
          type="date"
          id="endDate"
          name="endDate"
          value={itineraryData.endDate}
          onChange={handleChange}
          className="border border-gray-300 rounded-md px-3 py-2 w-full"
        />
      </div>
    </div>
    <div className="mb-4">
      <label htmlFor="description" className="block font-medium mb-2">
        Description
      </label>
      <textarea
        id="description"
        name="description"
        value={itineraryData.description}
        onChange={handleChange}
        className="border border-gray-300 rounded-md px-3 py-2 w-full"
      />
    </div>
    <div className="mb-4">
      <label htmlFor="completed" className="block font-medium mb-2">
        Is your task completed?
      </label>
      <textarea
        id="completed"
        name="completed"
        value={itineraryData.completed}
        onChange={handleChange}
        className="border border-gray-300 rounded-md px-3 py-2 w-full"
      />
    </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  ) : null;
};

export default EditTaskModal;
