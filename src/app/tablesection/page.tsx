import React, { ReactElement, RefObject, useRef } from 'react'
import TableSection from './TableSection'
import Navbar from '@/components/Navbar'

  
const page:React.FC= () => {

    
    return (
        <div>
            {/* <Navbar handleconnect={function (): void {
                throw new Error('Function not implemented.')
            }} status={false} Homeref={null} Workingref={null} Aboutref={null} FAQref={null} /> */}
            <TableSection ></TableSection>
        </div>
    )
}

export default page