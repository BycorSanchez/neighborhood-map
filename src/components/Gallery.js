import React, { Component } from "react";
import * as FlickrAPI from "../utils/FlickrAPI";
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';

class Gallery extends Component {
	state = {
		status: "loading",
		photos: []
	};

	componentDidMount() {
		const { marker } = this.props;
		if (!marker) return;

		FlickrAPI.searchPhotos(marker.title)
			.then(data => {
				const photos = FlickrAPI.photoURLs(data, "m");
				this.setState({ photos });
			});
	};

	render(){
		const { photos } = this.state;
		const { galleryOpen, handleClose } = this.props;

		return (
			<Dialog open={ galleryOpen } onClose={ handleClose } aria-labelledby="simple-dialog-title">
				<DialogTitle id="simple-dialog-title">Photo gallery</DialogTitle>
				<DialogContent>
					<GridList cellHeight={160} cols={2}>
						{	photos && 
							photos.map((photo, index) => 
					            (
                                	<GridListTile key={index}>
					            		<img src={photo} alt="" />
					            		<GridListTileBar title="Title" subtitle="Subtitle" />
					            	</GridListTile>
					            )
							)
						}
					</GridList>
				</DialogContent>
			</Dialog>
		);
	};
};

export default Gallery;