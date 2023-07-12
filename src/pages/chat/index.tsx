import { useRouter } from "next/router";
import { useEffect } from "react";

const HomeRedirect = () => {
    const router = useRouter();

    useEffect(() => {
        router.push("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
};

export default HomeRedirect;
