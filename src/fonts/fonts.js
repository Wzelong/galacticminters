import { createGlobalStyle } from "styled-components";
import GalacticFont from "./GalacticFont.otf";

export default createGlobalStyle`
    @font-face {
        font-family: 'GalacticFont';
        src: local('GalacticFont'), url(${GalacticFont}) format('opentype');
        font-weight: 300;
        font-style: normal;
    }
`;
