interface CircleProps {
  cx: string;
  cy: string;
  radius: string;
}

export default function Circle({ cx, cy, radius }: CircleProps) {
  return (
    <svg>
      <circle cx={cx} cy={cy} r={radius} />
    </svg>
  );
}
