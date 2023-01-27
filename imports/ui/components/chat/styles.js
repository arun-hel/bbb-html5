import styled from "styled-components";
import {
  colorWhite,
  colorGray,
} from "/imports/ui/stylesheets/styled-components/palette";
import { smallOnly } from "/imports/ui/stylesheets/styled-components/breakpoints";
import {
  mdPaddingX,
  smPaddingX,
} from "/imports/ui/stylesheets/styled-components/general";

const SmallTitle = styled.h2`
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  padding-bottom: ${smPaddingX};
  color: ${colorGray};
  margin: 0;
`;

const Chat = styled.div`
  background-color: ${colorWhite};
  padding: ${mdPaddingX};
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  justify-content: space-around;
  overflow: hidden;
  height: 100%;

  ${({ isChrome }) =>
    isChrome &&
    `
    transform: translateZ(0);
  `}

  @media ${smallOnly} {
    transform: none !important;
  }
`;

export default { Chat, SmallTitle };
