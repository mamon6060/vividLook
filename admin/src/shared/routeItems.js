import { IoImageOutline } from "react-icons/io5";
import {
  LuContact,
  LuMapPinned,
  LuPackageCheck,
} from "react-icons/lu";
import { MdOutlineCategory } from "react-icons/md";
import { VscGraph, VscTools } from "react-icons/vsc";
import { FaPersonDigging, FaRegCalendarCheck } from "react-icons/fa6";
import { BsCart3 } from "react-icons/bs";
import { BiCategoryAlt } from "react-icons/bi";
import { RiPoliceBadgeLine } from "react-icons/ri";
import { PiMapPinAreaLight } from "react-icons/pi";

export const menuItems = [
  { key: "summary", label: "Dashboard", icon: VscGraph },
  { key: "orders", label: "Orders", icon: LuPackageCheck },
  { key: "service-bookings", label: "Service Bookings", icon: FaRegCalendarCheck },
  {
    key: "homepage",
    icon: IoImageOutline,
    label: "Homepage",
    children: [
      { key: "banners", label: "Banners", icon: IoImageOutline },
      { key: "partners", label: "Partners", icon: IoImageOutline },
      // { key: "about-us", label: "About Us", icon: LuInfo },
      // { key: "latest-gallery", label: "Latest Gallery", icon: LuImages },
    ],
  },
  {
    key: "products",
    icon: BsCart3,
    label: "Products Page",
    children: [
      { key: "product-category", label: "Product Category", icon: BiCategoryAlt },
      { key: "product-brand", label: "Product Brands", icon: BiCategoryAlt },
      { key: "product-subcategory", label: "Product Subcategory", icon: BiCategoryAlt },
      { key: "products", label: "Products", icon: BsCart3 },
    ],
  },
  {
    key: "spare-parts",
    icon: BsCart3,
    label: "Spare Parts Page",
    children: [
      { key: "spare-parts-category", label: "Spare Parts Category", icon: BiCategoryAlt },
      { key: "spare-parts", label: "Spare Parts", icon: BsCart3 },
    ],
  },
  {
    key: "services",
    icon: VscTools,
    label: "Service Page",
    children: [
      {
        key: "service-category",
        label: "Service Categoy",
        icon: MdOutlineCategory,
      },
      { key: "services", label: "Services", icon: VscTools },
      { key: "mechanic", label: "Mechanic", icon: FaPersonDigging },
      { key: "district", label: "District", icon: LuMapPinned },
      { key: "thana", label: "Thana", icon: RiPoliceBadgeLine },
      { key: "area", label: "Area", icon: PiMapPinAreaLight },
    ],
  },
  // {
  //   key: "about-page",
  //   icon: GrGroup,
  //   label: "About Page",
  //   children: [
  //     { key: "profile", label: "Profile", icon: ImProfile },
  //     { key: "our-team", label: "Our Team", icon: GrGroup },
  //   ],
  // },
  // { key: "service", label: "Service", icon: MdOutlineHomeRepairService },
  // { key: "projects", label: "Projects", icon: AiOutlineFundProjectionScreen },

  // {
  //   key: "gallary-page",
  //   icon: LuImages,
  //   label: "Gallery Page",
  //   children: [
  //     { key: "gallery", label: "Gallery", icon: LuImages },
  //     { key: "video", label: "Video", icon: IoVideocamOutline },
  //   ],
  // },
  { key: "contacts", label: "Contact", icon: LuContact },

  // {
  //   key: "quote-page",
  //   icon: LuMessageSquareQuote,
  //   label: "Quote Page",
  //   children: [
  //     { key: "quotations", label: "Quotation", icon: LuMessageSquareQuote },
  //     { key: "service-criteria", label: "Service Criteria", icon: LuSettings2 },
  //   ],
  // },
];
