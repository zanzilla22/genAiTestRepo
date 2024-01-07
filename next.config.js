/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects: async () => {
    return [
      {
        source: "/github",
        destination: "https://github.com/theadityaraman/utsaa",
        permanent: true,
      },
      {
        source: "/project",
        destination: "https://docs.google.com/presentation/d/15w26chPkMSkQeJYTl_nDaoDCKWOR9TGGGBUlzaSnw0U/edit?usp=sharing",
        permanent: true,
      },
    ];
  },
  env: {
    REACT_APP_ASSISTANT_ID: process.env.REACT_APP_ASSISTANT_ID,
  },
};

module.exports = nextConfig;