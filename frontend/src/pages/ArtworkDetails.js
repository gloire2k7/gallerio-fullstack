import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { artworkService, orderService } from '../services/api';
import mtnLogo from '../assets/mtn.png';
import airtelLogo from '../assets/airtel.png';

const ArtworkDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showPhoneForm, setShowPhoneForm] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [showUssdMessage, setShowUssdMessage] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState('');

  const validatePhoneNumber = (number, provider) => {
    // Remove any non-digit characters
    const cleanNumber = number.replace(/\D/g, '');
    
    // Check length
    if (cleanNumber.length > 10) {
      return 'Phone number cannot be more than 10 digits';
    }

    // Validate based on provider
    if (provider === 'mtn') {
      if (!cleanNumber.startsWith('078') && !cleanNumber.startsWith('079')) {
        return 'MTN numbers must start with 078 or 079';
      }
    } else if (provider === 'airtel') {
      if (!cleanNumber.startsWith('073') && !cleanNumber.startsWith('072')) {
        return 'Airtel numbers must start with 073 or 072';
      }
    }

    return '';
  };

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    // Only allow digits
    const cleanValue = value.replace(/\D/g, '');
    setPhoneNumber(cleanValue);
    
    // Validate the number
    const error = validatePhoneNumber(cleanValue, selectedPayment);
    setPhoneError(error);
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setOrderError('');
    setOrderSuccess('');

    try {
      const orderData = {
        artworkId: artwork.id,
        phoneNumber: phoneNumber,
        paymentMethod: selectedPayment
      };

      const response = await orderService.createOrder(orderData);
      setShowUssdMessage(true);
      
      // Close modal and reset form after 3 seconds
      setTimeout(() => {
        setShowPaymentModal(false);
        setShowUssdMessage(false);
        setPhoneNumber('');
        setSelectedPayment(null);
        setShowPhoneForm(false);
        setPhoneError('');
        // Navigate to orders page
        navigate('/orders');
      }, 3000);
    } catch (error) {
      console.error('Error creating order:', error);
      setOrderError(error.response?.data?.message || 'Failed to create order. Please try again.');
    }
  };

  useEffect(() => {
    const fetchArtwork = async () => {
      try {
        const data = await artworkService.getArtwork(id);
        setArtwork(data);
      } catch (error) {
        setError('Failed to load artwork details');
        console.error('Error fetching artwork:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchArtwork();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-brown">Loading...</div>
      </div>
    );
  }

  if (error || !artwork) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-red-600">{error || 'Artwork not found'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-12">
      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => {
                setShowPaymentModal(false);
                setSelectedPayment(null);
                setShowPhoneForm(false);
                setPhoneNumber('');
                setPhoneError('');
              }}
            >
              &times;
            </button>
            {!showPhoneForm ? (
              <>
                <h2 className="text-xl font-bold mb-6 text-brown">Choose Payment Method</h2>
                <div className="flex flex-col gap-4">
                  <button
                    className="flex items-center gap-4 border rounded-lg p-4 hover:bg-yellow-50 transition"
                    onClick={() => {
                      setSelectedPayment('mtn');
                      setShowPhoneForm(true);
                      setPhoneNumber('');
                      setPhoneError('');
                    }}
                  >
                    <img src={mtnLogo} alt="MTN" className="w-10 h-10 object-contain" />
                    <span className="font-semibold text-brown">Pay with MTN mobile money</span>
                  </button>
                  <button
                    className="flex items-center gap-4 border rounded-lg p-4 hover:bg-red-50 transition"
                    onClick={() => {
                      setSelectedPayment('airtel');
                      setShowPhoneForm(true);
                      setPhoneNumber('');
                      setPhoneError('');
                    }}
                  >
                    <img src={airtelLogo} alt="Airtel" className="w-10 h-10 object-contain" />
                    <span className="font-semibold text-brown">Pay with Airtel mobile money</span>
                  </button>
                </div>
              </>
            ) : (
              <form
                onSubmit={handleOrderSubmit}
                className="flex flex-col gap-4"
              >
                {showUssdMessage ? (
                  <div className="text-center py-4">
                    <h3 className="text-lg font-semibold text-green-600 mb-2">USSD code sent to your phone</h3>
                    <p className="text-gray-600">Please complete the payment using the USSD code</p>
                  </div>
                ) : (
                  <>
                    <h2 className="text-lg font-bold text-brown mb-2">
                      {selectedPayment === 'mtn' ? 'MTN Mobile Money' : 'Airtel Mobile Money'}
                    </h2>
                    <div className="flex flex-col gap-2">
                      <label className="text-brown">Enter your phone number:</label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={handlePhoneNumberChange}
                        className={`border rounded-lg p-2 ${phoneError ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder={selectedPayment === 'mtn' ? 'e.g. 078XXXXXXXX' : 'e.g. 073XXXXXXXX'}
                        maxLength={10}
                        required
                      />
                      {phoneError && (
                        <p className="text-red-500 text-sm">{phoneError}</p>
                      )}
                    </div>
                    <button
                      type="submit"
                      className="bg-coral text-cream py-2 rounded-lg font-semibold hover:bg-coral/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!!phoneError || phoneNumber.length !== 10}
                    >
                      Pay Now
                    </button>
                  </>
                )}
              </form>
            )}
          </div>
        </div>
      )}
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left side - Image */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <img
              src={artwork.imageUrl ? (artwork.imageUrl.startsWith('http') ? artwork.imageUrl : `http://localhost:8080${artwork.imageUrl}`) : ''}
              alt={artwork.title}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Right side - Details */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-brown">{artwork.title}</h1>
              <span className={
                artwork.status === 'AVAILABLE'
                  ? 'text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full'
                  : 'text-xs bg-red-100 text-red-800 px-3 py-1 rounded-full'
              }>
                {artwork.status.toLowerCase()}
              </span>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-brown mb-2">Artist</h2>
                <p className="text-brown/80">
                  <Link
                    to={`/artist/${artwork.userId}`}
                    className="text-coral hover:underline"
                  >
                    {artwork.artistName}
                  </Link>
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-brown mb-2">Description</h2>
                <p className="text-brown/80">{artwork.description}</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-brown mb-2">Category</h2>
                <p className="text-brown/80 capitalize">{artwork.category}</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-brown mb-2">Price</h2>
                <p className="text-2xl font-bold text-coral">${artwork.price}</p>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="w-full bg-coral text-cream py-3 px-6 rounded-lg hover:bg-coral/90 transition-colors"
                  disabled={artwork.status !== 'AVAILABLE'}
                >
                  {artwork.status === 'AVAILABLE' ? 'Purchase Artwork' : 'Not Available'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtworkDetails; 