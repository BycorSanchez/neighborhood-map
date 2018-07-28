import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Hidden from '@material-ui/core/Hidden';
import Divider from '@material-ui/core/Divider';

const sidebarWidth = 240;

const styles = theme => ({
    root: {
        flexGrow: 1,
        height: 430,
        zIndex: 1,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        width: '100%',
    },
    drawerPaper: {
        width: sidebarWidth,
        [theme.breakpoints.up('md')]: {
            position: 'relative',
        },
    }
});

const SideBar = props => {
    const { classes, mobileOpen, onSidebarClose } = props;

    const sidebar = (
        <div>
            <Divider />
            <List>{"Places"}</List>
        </div>
    );

    return (
        <div>
            <Hidden mdUp>
                <Drawer
                    variant="temporary"
                    anchor="left"
                    open={mobileOpen}
                    onClose={onSidebarClose}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                >
                    {sidebar}
                </Drawer>
            </Hidden>
            <Hidden smDown implementation="css">
                <Drawer
                    variant="permanent"
                    open
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                >
                    {sidebar}
                </Drawer>
            </Hidden>
        </div>
    );
}

export default withStyles(styles, { withTheme: true })(SideBar);