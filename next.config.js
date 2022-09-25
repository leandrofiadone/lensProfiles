/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	images: {
		domains: [
			"lens.infura-ipfs.io",
			"statics-polygon-lens-staging.s3.eu-west-1.amazonaws.com",
		],
		remotePatterns: [
			{
				protocol: "ipfs",
				hostname: "**",
				pathname: "**",
			},
		],
	},
};

module.exports = nextConfig;
