import React from 'react';
import parse from 'html-react-parser'

interface Props{
    setbacks?: any,
    dep_map?: any,
}


export const SetbackDetails: React.FC<Props> = ( details ) => {
    var setbackContent = ''
    for(var t=0; t<details.setbacks.length; t++ ) {
        setbackContent += `<br>${details.setbacks[t]}<br>`
    }
    return (
        <div>
            <h3>SETBACK DATA</h3>
            <div className="setbackdetails">
            {parse(setbackContent)}
            </div>
            <h3>DEPENDANCY TREE</h3>
            <div className="depdetails">
            {parse(details.dep_map)}
            </div>
        </div>   
    )
};
