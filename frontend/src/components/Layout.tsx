import { makeStyles } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles({
    page: {
        background: '#f9f9f9',
        width: '100%'
    }
})

export const Layout = ({children}: any ) => {
    const classes = useStyles()
    return (
        <div className={classes.page}>
            {children}
        </div>   
    )
};