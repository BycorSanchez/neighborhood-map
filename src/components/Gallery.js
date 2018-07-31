import React, { Component } from "react";
import PropTypes from "prop-types";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import CircularProgress from "@material-ui/core/CircularProgress";

class Gallery extends Component {

	static propTypes = {
		status: PropTypes.oneOf(["hidden", "loading", "loaded", "error"]).isRequired,
		handleClose: PropTypes.func.isRequired,
		photos: PropTypes.array
	};

	showGallery() {
		return this.props.status !== "hidden";
	};

	render() {
		const { status, handleClose, photos } = this.props;

		return (
			<Dialog open={this.showGallery()} onClose={handleClose} aria-labelledby="dialog-title">
				<DialogTitle id="dialog-title">Photo gallery</DialogTitle>
				{status === "loading" &&
					(
						<DialogContent className="center-text">
							<CircularProgress size={50} />
						</DialogContent>
					)
				}
				{status === "loaded" &&
					(
						<DialogContent>
							<GridList cellHeight={160} cols={2}>
								{	photos &&
									photos.map((photo, index) =>
										(
											//Show image & description
											<GridListTile key={index}>
												<img src={photo.url} alt={photo.title} />
												<GridListTileBar title={photo.title} subtitle={`by ${photo.author}`} />
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
				{
					(!photos || status === "error") &&
					(
						<DialogContent>
							<DialogContentText className="center-text">
								Sorry, there are no photos available right now of this place.
							</DialogContentText>
						</DialogContent>
					)
				}
			</Dialog>
		);
	};
};

export default Gallery;