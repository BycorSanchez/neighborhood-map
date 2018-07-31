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
		data: PropTypes.array
	};

	showGallery() {
		return this.props.status !== "hidden";
	};

	render() {
		const { status, handleClose, data } = this.props;

		return (
			<Dialog open={this.showGallery()} onClose={handleClose} aria-labelledby="simple-dialog-title">
				<DialogTitle id="simple-dialog-title">Photo gallery</DialogTitle>
				{status === "loading" &&
					(
						<DialogContent className="gallery-loading">
							<CircularProgress size={50} />
						</DialogContent>
					)
				}
				{status === "loaded" &&
					(
						<DialogContent>
							<GridList cellHeight={160} cols={2}>
								{	data &&
									data.map((photo, index) =>
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