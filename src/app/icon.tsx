import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 20,
          background: 'rgba(129, 140, 248, 0.1)', // bg-primary/10 (primary #818cf8)
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#818cf8', // text-primary
          borderRadius: '8px',
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3c1.912 4.97 5.03 8.088 10 10-4.97 1.912-8.088 5.03-10 10-1.912-4.97-5.03-8.088-10-10 4.97-1.912 8.088-5.03 10-10z" />
          <path d="M5 3c.956 2.485 2.515 4.044 5 5-2.485.956-4.044 2.515-5 5-.956-2.485-2.515-4.044-5-5 2.485-.956 4.044-2.515 5-5z" />
          <path d="M19 3c.956 2.485 2.515 4.044 5 5-2.485.956-4.044 2.515-5 5-.956-2.485-2.515-4.044-5-5 2.485-.956 4.044-2.515 5-5z" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}
