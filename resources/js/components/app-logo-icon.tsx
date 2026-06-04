import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 40 42" xmlns="http://www.w3.org/2000/svg">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6 2H34V20C34 24 28 28 20 28C12 28 6 24 6 20V2Z
                   M6 6Q0 6 0 13Q0 20 6 20L6 18Q4 18 4 13Q4 8 6 8Z
                   M34 6Q40 6 40 13Q40 20 34 20L34 18Q36 18 36 13Q36 8 34 8Z
                   M17 28H23V34H17Z
                   M10 34H30V40H10Z"
            />
        </svg>
    );
}
