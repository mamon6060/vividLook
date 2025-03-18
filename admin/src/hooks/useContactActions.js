import { useState, useEffect } from "react";
import { message } from "antd";
import axiosInstance from "../components/Axios";

const useContactActions = () => {
  const [contacts, setContacts] = useState([]); // Stores all contacts
  const [contact, setContact] = useState(null); // Stores a single contact
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch All Contacts
  const getAllContacts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get("/contacts");
      setContacts(response.data.data.doc);
    } catch (error) {
      setError(error.response?.message || "Failed to get contacts");
      message.error("Failed to get contacts");
    } finally {
      setLoading(false);
    }
  };

  // Fetch a Single Contact by ID
  const getSingleContact = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/contacts/${id}`);
      setContact(response.data.data.doc);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to get contact");
      message.error("Failed to get contact");
    } finally {
      setLoading(false);
    }
  };

  // Create a New Contact
  const createContact = async (contactData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post("/contacts", contactData);
      setContacts((prev) =>
        Array.isArray(prev) ? [...prev, response.data.doc] : [response.data.doc]
      );
      await getAllContacts();
      message.success("Contact created successfully!");
      return response.data.contact;
    } catch (error) {
      setError(error.response?.message || "Failed to create contact");
      message.error("Failed to create contact");
    } finally {
      setLoading(false);
    }
  };

  // Update an Existing Contact
  const updateContact = async (id, contactData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.patch(
        `/contacts/${id}`,
        contactData
      );
      setContacts((prev) =>
        Array.isArray(prev) ? prev.filter((b) => b._id !== id) : []
      ); // Update state
      await getAllContacts();
      message.success("Contact updated successfully!");
      return response.data.doc;
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update contact");
      message.error("Failed to update contact");
    } finally {
      setLoading(false);
    }
  };

  // Delete a Contact
  const deleteContact = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await axiosInstance.delete(`/contacts/${id}`);
      setContacts((prev) => prev.filter((b) => b._id !== id)); // Remove from state
      await getAllContacts();
      message.success("Contact deleted successfully!");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete contact");
      message.error("Failed to delete contact");
    } finally {
      setLoading(false);
    }
  };

  // Auto-get contacts when hook is used
  useEffect(() => {
    getAllContacts();
  }, []);

  return {
    contacts,
    contact,
    loading,
    error,
    getAllContacts,
    getSingleContact,
    createContact,
    updateContact,
    deleteContact,
  };
};

export default useContactActions;
