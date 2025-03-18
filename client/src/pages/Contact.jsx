/* eslint-disable no-unused-vars */
import Containar from "../components/containar/Containar";
import ContractForm from "../components/Contract/ContractForm";
import ContractInfo from "../components/Contract/ContractInfo";
import OfficeLocation from "../components/Contract/OfficeLocation";
import SocialMediaLinks from "../components/Contract/SocialMediaLinks";
import BradCumbs from "../components/shared/BradCumbs";
import bdImg from "../assets/Contact/agriculture-bg.jpg";
import { FaFacebook, FaInstagram, FaXTwitter } from "react-icons/fa6";
import Partner from "../components/home/Partner";
import Gallery from "../components/Contract/Gallery";
import { useEffect } from "react";
import api from "../components/axios/Axios";
import { toast } from "react-toastify";

const Contact = () => {
  return (
    <div className="mx-auto font-robo lg:px-0">
      <OfficeLocation />
      <ContractForm />
      <ContractInfo />
      {/* <SocialMediaLinks /> */}
      {/* <Gallery /> */}
      {/* <Partner /> */}
    </div>
  );
};

export default Contact;
