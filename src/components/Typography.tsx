import styled from "@emotion/styled";

type TextVariant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "subtitle1"
  | "subtitle2"
  | "body1"
  | "body2";

const VARIANT_MAP: Record<TextVariant, React.ElementType> = {
  h1: "h2",
  h2: "h3",
  h3: "h4",
  h4: "h5",
  h5: "h5",
  h6: "h6",
  subtitle1: "h3",
  subtitle2: "h3",
  body1: "p",
  body2: "span",
};

export const Text: React.FC<{
  variant?: TextVariant;
  children?: React.ReactNode;
}> = ({ variant = "body1", children, ...props }) => (
  <TextTag as={VARIANT_MAP[variant]} {...props}>
    {children}
  </TextTag>
);

const TextTag = styled.p<{ variant?: TextVariant; secondary?: boolean }>(
  ({ secondary }) => ({
    color: secondary ? `var(--text-color-secondary)` : `var(--text-color)`,
  })
);
