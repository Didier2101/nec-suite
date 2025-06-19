"use client";

import Image from "next/image";

const Logo = ({
    width = 96,  // valor por defecto: 96px (w-24)
    height = 96, // valor por defecto: 96px (h-24)
}: {
    width?: number;
    height?: number;
}) => {
    return (
        <Image
            src="/logo-nec-oabw.svg"
            alt="Logo Nec"
            width={width}
            height={height}
            priority
        />
    );
};

export default Logo;
