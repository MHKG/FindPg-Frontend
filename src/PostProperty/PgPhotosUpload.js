import "../Styles/PgPhotosUpload.css";
import Header from "../Header";
import { useNavigate } from "react-router-dom";
import Legend from "./Legend";
import uploadImageRect from "../images/uploadImageRect.png";
import React, { useRef, useState } from "react";
import { Button } from "react-bootstrap";
import { axiosInstance } from "../AxiosInstance";

export default function PgPhotosUpload() {
	const imageUrls = JSON.parse(sessionStorage.getItem("pgImageUrl"));

	const [images, setImages] = useState(() => {
		const filledImages = imageUrls
			? imageUrls.map(
					(image) => "http://localhost:8080/image_controller/" + image
			  )
			: [];

		return Array(6)
			.fill(uploadImageRect)
			.map((item, index) => filledImages[index] || item);
	});
	const [selectedFiles, setSelectedFiles] = useState([]);
	const fileInputRefs = useRef([]);
	const [errorMessage, setErrorMessage] = useState("");
	const navigate = useNavigate();

	const handleImageClick = (index) => {
		fileInputRefs.current[index].click();
	};

	const changeImg = (index, e) => {
		const file = e.target.files[0];
		if (file) {
			if (file.type.startsWith("image/")) {
				const imageUrl = URL.createObjectURL(file);
				const newImages = [...images];
				newImages[index] = imageUrl;
				setImages(newImages);

				const newSelectedFiles = [...selectedFiles];
				newSelectedFiles[index] = file;
				setSelectedFiles(newSelectedFiles);
				setErrorMessage("");
			} else {
				setErrorMessage("Please upload a valid image file.");
			}
		}
	};

	const handleRemoveImage = async (index) => {
		const newImages = [...images];
		const filePath = newImages[index].split("/")[4];
		await axiosInstance.post(
			"/image_controller/remove_image",
			new URLSearchParams({ filePath: filePath }),
			{
				headers: {
					Authorization: "Bearer " + sessionStorage.getItem("token"),
				},
			}
		);

		newImages[index] = uploadImageRect;
		setImages(newImages);

		const newSelectedFiles = [...selectedFiles];
		newSelectedFiles[index] = null;
		setSelectedFiles(newSelectedFiles);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const formData = new FormData();
		selectedFiles.forEach((file) => {
			if (file) {
				formData.append("file", file);
			}
		});
		formData.append("pg_id", sessionStorage.getItem("pg_id"));
		formData.append("room_id", Array(selectedFiles.length).fill(""));
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
			if (imageResponse) {
				const newPgImageIds = imageResponse.data.map(
					(data) => data.image_id
				);

				const newPgImageUrls = imageResponse.data.map(
					(data) => data.image
				);

				sessionStorage.setItem(
					"pgImageIds",
					JSON.stringify([...newPgImageIds])
				);

				const pgImageUrl = [...(imageUrls || []), ...newPgImageUrls];

				sessionStorage.setItem(
					"pgImageUrl",
					JSON.stringify(pgImageUrl)
				);
			}
		} catch (error) {
			console.error("Error:", error);
			setErrorMessage("Failed to upload images. Please try again.");
			return;
		}

		navigate("/RoomsPhotosUpload");
	};

	const goBack = () => {
		navigate("/Pricing");
	};

	return (
		<div className="photosUpload">
			<div className="header">
				<Header />
			</div>
			<div className="container" style={{ maxWidth: 1376 }}>
				<div
					className="d-flex flex-row"
					style={{ marginTop: 72, marginBottom: 348, gap: 24 }}
				>
					<Legend currentPage={4} />
					<div className="photosDetails">
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

						<div className="propertyDetails">
							<h2 className="detailHeading">Photos of Pg</h2>
							<p className="detail">
								Property with Photos Get More Attention
							</p>
						</div>

						<div className="image-grid">
							{images.map((imageSrc, index) => (
								<div className="image-wrapper" key={index}>
									<img
										src={imageSrc}
										alt={`Upload Image ${index + 1}`}
										className="image-tile"
										onClick={() => handleImageClick(index)}
									/>
									<input
										type="file"
										accept="image/*"
										onChange={(e) => changeImg(index, e)}
										ref={(el) =>
											(fileInputRefs.current[index] = el)
										}
										style={{ display: "none" }}
									/>
									{imageSrc !== uploadImageRect && (
										<button
											className="remove-image-button"
											onClick={() =>
												handleRemoveImage(index)
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
