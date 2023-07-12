// import dynamic from "next/dynamic";
import Head from "next/head";

import App from "@/Components/App";

const Home = () => {
    return (
        <>
            <Head>
                <title>Open Assistant</title>
                <meta content="yes" />
                <meta content="Chatbot UI"></meta>
            </Head>
            <App />
        </>
    );
};

export default Home;
