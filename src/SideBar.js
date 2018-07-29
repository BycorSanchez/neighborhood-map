import React, { Component } from 'react';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';

const SideBar = props => {
    const { mobileOpen, onSidebarClose } = props;

    const sidebar = (
        <div className="sidebar">
            <Divider />
            <List>{"Places"}</List>
        </div>
    );

    return (
        <div className="flex-grow">
            <Drawer
                variant="temporary"
                anchor="left"
                open={mobileOpen}
                onClose={onSidebarClose}
                className="drawer-mobile"
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
            >
                {sidebar}
            </Drawer>

            <Drawer
                variant="permanent"
                open
                className="drawer-desktop"
            >
                {sidebar}
            </Drawer>
        </div>
    );
}

export default SideBar;