import React, { Component } from "react";
import PropTypes from "prop-types";
import * as FlickrAPI from "../utils/FlickrAPI";
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import CircularProgress from '@material-ui/core/CircularProgress';

class Gallery extends Component {

	static propTypes = {
		galleryOpen: PropTypes.bool.isRequired,
		handleClose: PropTypes.func.isRequired
	};

	state = {
		status: "loading",
		photos: []
	};

	componentDidMount() {
		this.loadPhotos(this.props.marker);
	};

	loadPhotos = marker => {
		if (!marker) return;

		FlickrAPI.searchPhotos(marker.title)
			.then(data => {
				const photos = data.map(photo => FlickrAPI.photoURL(photo, "m"));
				this.setState({ photos, status: "loaded" });
			})
			.catch(error => {
				console.log("Images search failed", error);
				this.setState({ status: "abort" });
			});
	};


	render() {
		const { status, photos } = this.state;
		const { galleryOpen, handleClose } = this.props;

		return (
			<Dialog open={galleryOpen} onClose={handleClose} aria-labelledby="simple-dialog-title">
				<DialogTitle id="simple-dialog-title">Photo gallery</DialogTitle>
				{status === "loading" &&
					(
						<DialogContent className="gallery-loading">
							<CircularProgress size={50} />
						</DialogContent>
					)
				}
				{status !== "loading" &&
					(
						<DialogContent>
							<GridList cellHeight={160} cols={2}>
								{photos &&
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
							<DialogContentText>
								Images provided by <a href="https://www.flickr.com/">Flickr</a>
							</DialogContentText>
						</DialogContent>
					)
				}
			</Dialog>
		);
	};
};

export default Gallery;