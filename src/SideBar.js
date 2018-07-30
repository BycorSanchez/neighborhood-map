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
    const { markers, currentMarker, mobileOpen, onSidebarClose, onFilter, onMarkerSelect } = props;

    //Sidebar code
    const sidebar = (
        <div className="sidebar">
            {/* Filter field */}
            <TextField
                placeholder="Filter by name"
                className="filter-input"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
                fullWidth={true}
                onChange={event => onFilter(event.target.value)}
            />
            {/* List of visible markers */}
            <List>
                {markers &&
                    markers.filter(marker => marker.visible)
                        .map(marker => (
                            <ListItem
                                button
                                key={marker.id}
                                className={(currentMarker && marker.id === currentMarker.id) ? "list-item list-item-selected" : "list-item"}
                                onClick={() => onMarkerSelect(marker)}
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

    // There are two sidebars: 
    //    - Temporary sidebar, displayed on small screen devices showing & hidding when menu button is clicked
    //    - Permanent sidebar, displayed on large screens. Always visible.
    //
    // CSS controls which one of them is displayed
    return (
        <div className="flex-grow">
            <Drawer
                variant="temporary"
                anchor="left"
                open={mobileOpen}
                onClose={onSidebarClose}
                className="drawer-mobile"
                ModalProps={{
                    keepMounted: true, // Material UI parameter, enhances open performance on mobile
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
    onSidebarClose: PropTypes.func.isRequired,
    onFilter: PropTypes.func.isRequired,
    onMarkerSelect: PropTypes.func.isRequired,
    currentMarker: PropTypes.object
}

export default SideBar;