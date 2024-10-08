import styled from "@emotion/styled";

export const Flex = styled.div<{
  row?: boolean;
  rowReverse?: boolean;
  col?: boolean;
  colReverse?: boolean;
  justify?: string;
  align?: string;
  grow?: string;
  shrink?: string;
  gap?: number;
}>`
  ${({ row }) => row && `display: flex; flex-direction: row;`}
  ${({ rowReverse }) =>
    rowReverse && `display: flex; flex-direction: row-reverse;`}

  ${({ col }) => col && `display: flex; flex-direction: column;`}
  ${({ colReverse }) =>
    colReverse && `display: flex; flex-direction: column-reverse;`}

  ${({ justify }) => justify && `justify-content: ${justify};`}
  ${({ align }) => align && `align-items: ${align};`}
  ${({ gap }) => gap && `gap: ${gap}px;`}

  ${({ grow }) => grow && `flex-grow: ${grow};`}
  ${({ shrink }) => shrink && `flex-shrink: ${shrink}; min-width: 0;`}
`;
