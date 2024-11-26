import React from 'react'
import { IconSearch } from '../../assests/icons/MapToolsIcons'
import IconList from '../../assests/icons/EPCIcons/IconList'
import NewAccordion from '../../Components/New/Accordion/NewAccordion'

const BillOfQuantities = () => {
  return (
    <>
       <div className="flex justify-end items-center">      
        <div className="flex gap-1">
          <button className="light-md-btn">
            <IconSearch />
            <input
              id="inpSearch"
              className={`text-primary-500 text-1.6xl font-medium placeholder-primary-500 focus:outline-none w-[7vh]`}
              type="search"
              placeholder="Search"
              //   onKeyUp={handleInputChange}
            />
          </button>
          <button className="light-md-btn gap-1">
            <IconList />
            Download Detailed BOQ
          </button>
        </div>
      </div>
        <div className="h2"></div>
        <hr className='text-primary-700/40 h-[0.2vh] ' />
        <div className="h2"></div>
        <div className='acc-main'>
      </div>
    </>
  )
}

export default BillOfQuantities
