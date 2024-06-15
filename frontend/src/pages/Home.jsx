import React, { useState , useEffect } from 'react';
import Navbar from './Navbar';
import EditTaskModal from '../components/updateModal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faEye, faTrash } from '@fortawesome/free-solid-svg-icons';
const Home = () => {
    const [itineraries, setItineraries] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [itineraryToEdit, setItineraryToEdit] = useState(null);
  
    const handleEditItinerary = (itineraryId) => {
      // Find the itinerary object with the given itineraryId
      const itineraryToEdit = itineraries.find((itinerary) => itinerary._id === itineraryId);
      setItineraryToEdit(itineraryToEdit);
      setShowEditModal(true);
    };
  
    const handleCloseEditModal = () => {
      setItineraryToEdit(null);
      setShowEditModal(false);
    };
    useEffect(() => {
        const fetchItineraries = async () => {
          try {
            // Get user details from local storage
            const userDetails = JSON.parse(localStorage.getItem('user'));
            console.log('User details:', userDetails);
            if (!userDetails || !userDetails.id) {
              throw new Error('User ID not found in userDetails');
            }
    
            const userId = userDetails.id;
            console.log('User ID:', userId);
    
            const response = await fetch(`http://localhost:5000/users/getItineraries/${userId}`);
    
            if (!response.ok) {
              throw new Error('Failed to fetch itineraries');
            }
    
            const data = await response.json();
            setItineraries(data); // Assuming data is an array of itinerary objects
          } catch (error) {
            console.error('Error fetching itineraries:', error);
            // Handle error state or display an error message
          }
        };
    
        fetchItineraries();
      }, []);
      const handleDeleteItinerary = async (itineraryId) => {
        try {
          const response = await fetch(`http://localhost:5000/users/deleteItinerary/${itineraryId}`, {
            method: 'DELETE',
          });
    
          if (response.ok) {
            console.log('Itinerary deleted successfully');
            // Remove the deleted itinerary from the state
            setItineraries((prevItineraries) => prevItineraries.filter((itinerary) => itinerary._id !== itineraryId));
            window.location.reload(); 
          } else {
            console.error('Failed to delete itinerary');
          }
        } catch (error) {
          console.error('Error deleting itinerary:', error);
        }
      };
  return (
    <>
      <Navbar />
      <div className="itineraries-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {itineraries.map((itinerary) => (
          <div key={itinerary._id} className="card bg-white rounded-lg shadow-md overflow-hidden">
            <div className="card-header bg-gray-200 px-4 py-2 flex justify-between items-center">
              <h2 className="text-lg font-semibold">{itinerary.title}</h2>
              <div className="icons">
                <button className="text-blue-500 hover:text-blue-700 mr-2" onClick={() => handleEditItinerary(itinerary._id)}>
                  <FontAwesomeIcon icon={faEdit} />
                </button>
             
             
                <button className="text-red-500 hover:text-red-700" onClick={() => handleDeleteItinerary(itinerary._id)}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
              </div>
            </div>
            <div className="card-body px-4 py-2">
              <p>
                <span className="font-semibold">Start Date:</span>{' '}
                {new Date(itinerary.startDate).toLocaleDateString()}
              </p>
              <p>
                <span className="font-semibold">End Date:</span>{' '}
                {new Date(itinerary.endDate).toLocaleDateString()}
              </p>
              <p>
                <span className="font-semibold">Description:</span>{' '}
                {itinerary.description}
              </p>
              <p>
                <span className="font-semibold">Completed:</span>{' '}
                {itinerary.completed ? 'Yes' : 'No'}
              </p>
            </div>
          </div>
        ))}
      </div>
      {showEditModal && (
        <EditTaskModal
          isOpen={showEditModal}
          onClose={handleCloseEditModal}
          itineraryToEdit={itineraryToEdit}
        />
      )}
      
    </>
  );
};

export default Home;
