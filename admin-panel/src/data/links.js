import React from 'react';
import { AiOutlineCalendar, AiOutlineShoppingCart, AiOutlineAreaChart, AiOutlineBarChart, AiOutlineStock, AiFillHome } from 'react-icons/ai';
import { FiShoppingBag, FiEdit, FiPieChart, FiBarChart, FiCreditCard, FiStar, FiShoppingCart } from 'react-icons/fi';
import { BsQrCodeScan } from 'react-icons/bs';
import { MdSpaceDashboard } from 'react-icons/md';
import { BiQrScan, BiHomeAlt2 } from 'react-icons/bi';
import { TbLayoutDashboard } from 'react-icons/tb';


export const links = [
    {
      title: 'Home',
      links: [
        {
          name: 'Home',
          icon: <BiHomeAlt2 />,
        },
      ],
    },
  
    {
      title: 'Pages',
      links: [
        {
          name: 'Dashboard',
          icon: <TbLayoutDashboard />,
        },
        {
          name: 'Generate',
          icon: <BsQrCodeScan />,
        },
      ],
    },
  ];