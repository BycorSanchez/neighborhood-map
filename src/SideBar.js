import React from "react";
import PropTypes from "prop-types";

import Drawer from "@material-ui/core/Drawer";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import SearchIcon from "@material-ui/icons/Search";

const SideBar = props => {
    const { markers, mobileOpen, onSidebarClose } = props;

    const sidebar = (
        <div className="sidebar">
            <TextField
                placeholder="Filter"
                className="search-input"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
                fullWidth={true}
            />
            <List>
                {   markers &&
                    markers.map(marker => (
                        <ListItem
                            button
                            key={marker.id}
                            className="list-item"
                        >
                            <ListItemText
                                primary={marker.title}
                                secondary={marker.address}
                            />
                        </ListItem>
                    ))
                }
            </List>
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

SideBar.propTypes = {
    markers: PropTypes.array.isRequired,
    mobileOpen: PropTypes.bool.isRequired,
    onSidebarClose: PropTypes.func.isRequired
}

export default SideBar;