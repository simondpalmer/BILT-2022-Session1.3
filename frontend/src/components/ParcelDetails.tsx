import React from 'react';
import parse from 'html-react-parser'

interface Props{
    details?: any,
    parcel?: any,
    parcelname?: any
}

export const ParcelDetails: React.FC<Props> = ( details ) => {
    return (
        <div>
            <h2>{details.parcelname}</h2>
            <h3>PARCEL DATA</h3>
            <div className="parceldetails">
            {parse(details.parcel)}
            </div>
            <h3>ZONING DATA</h3>
            <div className="zoningdetails">
            {parse(details.details)}
            </div>
        </div>   
    )
};
