import "../Styles/RoomsPhotosUpload.css";
import Header from "../Header";
import { useNavigate } from "react-router-dom";
import Legend from "./Legend";
import uploadImageRect from "../images/uploadImageRect.png";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "react-bootstrap";
import { axiosInstance } from "../AxiosInstance";

export default function RoomsPhotosUpload() {
	const [images, setImages] = useState([]);
	const [selectedFiles, setSelectedFiles] = useState([]);
	const fileInputRefs = useRef([]);
	const [errorMessage, setErrorMessage] = useState("");
	const navigate = useNavigate();

	const roomType = JSON.parse(sessionStorage.getItem("roomSharingType"));
	const lengthOfRoomType = roomType.length;

	const roomDetails = JSON.parse(sessionStorage.getItem("roomDetails"));

	useEffect(() => {
		const initialImages = roomType.map(() =>
			Array(6).fill(uploadImageRect)
		);

		const initialSelectedFiles = roomType.map(() =>
			Array(6).fill(undefined)
		);

		fileInputRefs.current = roomType.map(() => Array(6).fill(null));

		setImages(initialImages);
		setSelectedFiles(initialSelectedFiles);
	}, []);

	const handleImageClick = (idx, index) => {
		if (fileInputRefs.current[idx][index]) {
			fileInputRefs.current[idx][index].click();
		}
	};

	const changeImg = (idx, index, e) => {
		const file = e.target.files[0];
		if (file) {
			if (file.type.startsWith("image/")) {
				const imageUrl = URL.createObjectURL(file);
				const newImages = [...images];
				newImages[idx][index] = imageUrl;
				setImages(newImages);

				const newSelectedFiles = [...selectedFiles];
				newSelectedFiles[idx][index] = file;
				setSelectedFiles(newSelectedFiles);
				setErrorMessage("");
			} else {
				setErrorMessage("Please upload a valid image file.");
			}
		}
	};

	const setFileCurrentRefs = (el, idx, index) => {
		fileInputRefs.current[idx][index] = el;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const formData = new FormData();
		selectedFiles.forEach((files, idx) => {
			files.forEach((file, index) => {
				if (file) {
					formData.append("file", file);
					formData.append("room_id", roomDetails[idx].room_id);
				}
			});
		});

		formData.append("pg_id", sessionStorage.getItem("pg_id"));

		try {
			const imageResponse = await axiosInstance.post(
				"/image_controller/uploadAll",
				formData,
				{
					headers: {
						Authorization:
							"Bearer " + sessionStorage.getItem("token"),
						"Content-Type": "multipart/form-data",
					},
				}
			);

			let imageIdx = 0;
			const roomsImagesData = {
				images: [],
			};

			for (let i = 0; i < selectedFiles.length; i++) {
				for (let j = 0; j < selectedFiles[i].length; j++) {
					if (selectedFiles[i][j]) {
						roomsImagesData.images.push({
							roomType: roomType[i],
							image: imageResponse.data[imageIdx].image,
						});
						imageIdx++;
					}
				}
			}

			sessionStorage.setItem(
				"roomImages",
				JSON.stringify(roomsImagesData)
			);
		} catch (error) {
			console.error("Error:", error);
			setErrorMessage("Failed to upload images. Please try again.");
			return;
		}
		navigate("/FoodMenuDetails");
	};

	const goBack = () => {
		navigate("/PgPhotosUpload");
	};

	const handleRemoveImage = (idx, index) => {
		const newImages = [...images];
		newImages[idx][index] = uploadImageRect;
		setImages(newImages);

		const newSelectedFiles = [...selectedFiles];
		newSelectedFiles[idx][index] = null;
		setSelectedFiles(newSelectedFiles);
	};

	return (
		<div className="roomPhotosUpload">
			<div className="header">
				<Header />
			</div>
			<div className="container" style={{ maxWidth: 1376 }}>
				<div
					className="d-flex flex-row"
					style={{ marginTop: 72, marginBottom: 348, gap: 24 }}
				>
					<Legend currentPage={5} />
					<div className="roomsPhotosDetails">
						<div className="backPage" onClick={goBack}>
							<svg
								className="backArrow"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M7.82843 10.9999H20V12.9999H7.82843L13.1924 18.3638L11.7782 19.778L4 11.9999L11.7782 4.22168L13.1924 5.63589L7.82843 10.9999Z"
									fill="#6B788E"
								/>
							</svg>
							<p className="back">Back</p>
						</div>

						<div className="roomPhotos">
							<h2 className="roomHeading">Photos of Rooms</h2>
							<p className="roomDetail">
								Property with Photos Get More Attention
							</p>
						</div>
						{roomType.map((type, idx) => (
							<div key={idx}>
								<p className="typeSharing">
									Photos for {type} sharing rooms
								</p>
								<div className="image-grid">
									{images[idx] &&
										images[idx].map((imageSrc, index) => (
											<div className="image-wrapper" key={index}>
												<img
													src={imageSrc}
													alt={`Upload Image ${
														index + 1
													}`}
													className="images"
													onClick={() =>
														handleImageClick(
															idx,
															index
														)
													}
												/>
												<input
													type="file"
													accept="image/*"
													onChange={(e) =>
														changeImg(idx, index, e)
													}
													ref={(el) =>
														setFileCurrentRefs(
															el,
															idx,
															index
														)
													}
													style={{ display: "none" }}
												/>
												{imageSrc !==
													uploadImageRect && (
													<button
														className="remove-image-button"
														onClick={() =>
															handleRemoveImage(
																idx,
																index
															)
														}
													>
														<span className="remove-icon">
															<svg
																xmlns="http://www.w3.org/2000/svg"
																width="24"
																height="24"
																viewBox="0 0 24 24"
																fill="none"
															>
																<path
																	d="M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4149L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z"
																	fill="white"
																/>
															</svg>
														</span>
													</button>
												)}
											</div>
										))}
								</div>
							</div>
						))}
						{errorMessage && (
							<p className="text-danger">{errorMessage}</p>
						)}
						<Button
							variant="primary"
							onClick={handleSubmit}
							className="continueBtnUpload"
						>
							Continue
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
