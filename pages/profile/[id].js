import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { client, getProfiles, getPublications } from "../api/api";
import { ethers } from "ethers";
import ABI from "../../abi.json";

const CONTRACT_ADDRESS = "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d";

export default function Profile() {
	const [profile, setProfile] = useState();
	const [pubs, setPubs] = useState([]);
	const [account, setAccount] = useState("");
	const router = useRouter();
	const { id } = router.query;

	useEffect(() => {
		if (id) {
			fetchProfile();
		}
	}, [id]);

	async function fetchProfile() {
		try {
			const response = await client.query(getProfiles, { id }).toPromise();
			console.log("responseProfile: ", response);
			setProfile(response.data.profiles.items[0]);
			const publicationData = await client
				.query(getPublications, { id })
				.toPromise();
			console.log("PublicationDataaa :", { publicationData });
			setPubs(publicationData.data.publications.items);
		} catch (err) {}
	}

	async function connectWallet() {
		const accounts = await window.ethereum.request({
			method: "eth_requestAccounts",
		});
		console.log("accounts: ", accounts);
		accounts[0];
		setAccount(account);
	}

	function getSigner() {
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		return provider.getSigner();
	}

	async function followUser() {
		const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, getSigner());

		try {
			const tx = await contract.follow([id], [0x0]);
			await tx.wait();
			console.log(`successfully followed ... ${profile.handle}`);
		} catch (err) {
			console.log("error: ", err);
		}
	}

	if (!profile) return null;

	return (
		<div>
			<button style={{ margin: "10px" }} onClick={connectWallet}>
				Connect
			</button>
			<button style={{ margin: "10px" }} onClick={followUser}>
				Follow User
			</button>
			<br></br>
			<div>
				{" "}
				{profile?.picture ? (
					<Image
						width="200vw"
						height="200vh"
						src={profile.picture?.original?.url}
						alt="Picture of the authors"
					/>
				) : (
					<div
						style={{
							width: "400px",
							height: "200px",
							backgroundColor: "black",
						}}
					/>
				)}
			</div>
			<div>
				<h4>{profile?.handle}</h4>
				<p>{profile?.bio}</p>
				<p>Followers: {profile?.stats.totalFollowers}</p>
				<p>Following: {profile?.stats.totalFollowing}</p>
			</div>
			<div>
				{pubs.map((pub, index) => (
					<div
						key={index}
						style={{ padding: "20px", borderTop: "10px", border: "0.5px" }}>
						<p>{pub.metadata.content}</p>
					</div>
				))}
			</div>
		</div>
	);
}
