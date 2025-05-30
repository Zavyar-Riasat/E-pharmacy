"use client";

import {
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
} from "flowbite-react";
import Link from "next/link";

export function Component() {
  return (
    <div>
      <div className="bg-[#343148FF]">
        <Navbar
          fluid
          rounded
          className="bg-[#D7C49EFF] text-white shadow-lg sticky top-0 z-50"
        >
          <NavbarBrand as={Link} href="/">
            <img
              src="/img/logo.png"
              className="mr-3 h-10 w-10 rounded-full"
              alt="Flowbite React Logo"
            />
            <span className="self-center text-2xl font-bold tracking-wide text-white">
              Pharmacy
            </span>
          </NavbarBrand>
          <NavbarToggle />
          <NavbarCollapse>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <NavbarLink href="/Admin/mystore">
                <span className="text-white hover:border-2 border-[#343148FF] font-bold bg-[#343148FF] px-6 py-3 rounded-2xl hover:text-gray-300 transition-colors duration-200">
                  My Store
                </span>
              </NavbarLink>
              <NavbarLink href="/Admin/order">
                <span className="text-white hover:border-2 border-[#343148FF] font-bold bg-[#343148FF] px-6 py-3 rounded-2xl hover:text-gray-300 transition-colors duration-200">
                Orders
                </span>
              </NavbarLink>
            </div>
          </NavbarCollapse>
        </Navbar>
      </div>
    </div>
  );
}
