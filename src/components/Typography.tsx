import styled from "@emotion/styled";

export const Text = styled.p<{ secondary?: boolean; italic?: boolean }>(
  ({ secondary }) => ({
    color: secondary ? `var(--text-color-secondary)` : `var(--text-color)`,
  })
);
