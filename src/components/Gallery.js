import React, { Component } from "react";

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';

class Gallery extends Component {
	
	render(){
		const { galleryOpen, handleClose } = this.props;

		return (
			<Dialog open={ galleryOpen } onClose={ handleClose } aria-labelledby="simple-dialog-title">
				<DialogTitle id="simple-dialog-title">Photo gallery</DialogTitle>
				<DialogContent>
			      <GridList cellHeight={160} cols={2}>
			          <GridListTile>
			            <img src="https://material-ui.com/static/images/grid-list/camera.jpg" alt={"camera"} />
			            <GridListTileBar 
			            	title={"Title"}
              				subtitle={"Subtitle"}
              			/>
			          </GridListTile>
			          <GridListTile>
			            <img src="https://material-ui.com/static/images/grid-list/burgers.jpg" alt={"burger"} />
			            <GridListTileBar 
			            	title={"Title"}
              				subtitle={"Subtitle"}
              			/>
			          </GridListTile>
			      </GridList>
				</DialogContent>
			</Dialog>
		);
	};
};

export default Gallery;