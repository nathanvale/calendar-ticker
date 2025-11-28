import { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";

// WebSocket URL - uses relative path in production, configurable for dev
const WS_URL = import.meta.env.VITE_WS_URL || `ws://${window.location.host}/ws`;

function App() {
	const [events, setEvents] = useState([]);
	const [config, setConfig] = useState({
		display: {
			scroll_speed: 60,
			pause_duration: 0,
			event_gap: 100,
			time_format: "12h",
			position: "bottom",
			font_size: 42,
			show_clock: true,
		},
		no_events_message: "No upcoming events today ✨",
	});
	const [connected, setConnected] = useState(false);
	const [currentTime, setCurrentTime] = useState(new Date());

	const wsRef = useRef(null);
	const reconnectTimeoutRef = useRef(null);
	const tickerRef = useRef(null);
	const contentRef = useRef(null);

	// Connect to WebSocket
	const connectWebSocket = useCallback(() => {
		if (wsRef.current?.readyState === WebSocket.OPEN) return;

		console.log("Connecting to WebSocket:", WS_URL);
		const ws = new WebSocket(WS_URL);

		ws.onopen = () => {
			console.log("WebSocket connected");
			setConnected(true);
		};

		ws.onmessage = (event) => {
			try {
				const message = JSON.parse(event.data);
				if (message.type === "events") {
					setEvents(message.data || []);
					if (message.config) {
						setConfig((prev) => ({ ...prev, ...message.config }));
					}
				}
			} catch (e) {
				console.error("Error parsing message:", e);
			}
		};

		ws.onclose = () => {
			console.log("WebSocket disconnected");
			setConnected(false);
			// Reconnect after 5 seconds
			reconnectTimeoutRef.current = setTimeout(connectWebSocket, 5000);
		};

		ws.onerror = (error) => {
			console.error("WebSocket error:", error);
		};

		wsRef.current = ws;
	}, []);

	// Initial connection
	useEffect(() => {
		connectWebSocket();

		return () => {
			if (reconnectTimeoutRef.current) {
				clearTimeout(reconnectTimeoutRef.current);
			}
			if (wsRef.current) {
				wsRef.current.close();
			}
		};
	}, [connectWebSocket]);

	// Update clock
	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentTime(new Date());
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	// Ticker animation
	useEffect(() => {
		if (!tickerRef.current || !contentRef.current || events.length === 0)
			return;

		const _ticker = tickerRef.current;
		const content = contentRef.current;
		const speed = config.display?.scroll_speed || 60;

		// Duplicate content for seamless loop
		const contentWidth = content.scrollWidth / 2;
		let position = 0;

		const animate = () => {
			position -= speed / 60; // 60fps
			if (position <= -contentWidth) {
				position = 0;
			}
			content.style.transform = `translateX(${position}px)`;
			requestAnimationFrame(animate);
		};

		const animationId = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(animationId);
	}, [events, config.display?.scroll_speed]);

	// Format time for clock
	const formatClock = (date) => {
		const timeFormat = config.display?.time_format || "12h";
		if (timeFormat === "12h") {
			return date
				.toLocaleTimeString("en-AU", {
					hour: "numeric",
					minute: "2-digit",
					hour12: true,
				})
				.toLowerCase();
		}
		return date.toLocaleTimeString("en-AU", {
			hour: "2-digit",
			minute: "2-digit",
			hour12: false,
		});
	};

	// Render single event
	const renderEvent = (event, index) => {
		const fontSize = config.display?.font_size || 42;
		const importantSize = fontSize * 1.15;

		return (
			<div
				key={`${event.id}-${index}`}
				className={`event ${event.is_important ? "important" : ""}`}
				style={{
					marginRight: config.display?.event_gap || 100,
				}}
			>
				{config.display?.show_calendar_indicator !== false && (
					<span
						className="calendar-indicator"
						style={{ backgroundColor: event.colour }}
					/>
				)}
				<span
					className="event-time"
					style={{
						fontSize: event.is_important ? importantSize * 0.8 : fontSize * 0.8,
					}}
				>
					{event.time_str}
				</span>
				<span className="event-separator">—</span>
				<span
					className="event-title"
					style={{ fontSize: event.is_important ? importantSize : fontSize }}
				>
					{event.title}
				</span>
				{event.is_important && <span className="important-badge">!</span>}
			</div>
		);
	};

	const position = config.display?.position || "bottom";

	return (
		<div className="app">
			{/* Background - pure black for OLED */}
			<div className="background" />

			{/* Clock */}
			{config.display?.show_clock && (
				<div className="clock">{formatClock(currentTime)}</div>
			)}

			{/* Connection status indicator */}
			<div
				className={`connection-status ${connected ? "connected" : "disconnected"}`}
			/>

			{/* Ticker */}
			<div ref={tickerRef} className={`ticker ticker-${position}`}>
				{events.length > 0 ? (
					<div ref={contentRef} className="ticker-content">
						{/* Render events twice for seamless loop */}
						{events.map((event, i) => renderEvent(event, i))}
						{events.map((event, i) => renderEvent(event, i + events.length))}
					</div>
				) : (
					<div className="no-events">{config.no_events_message}</div>
				)}
			</div>

			{/* Subtle gradient overlay at edges */}
			<div className={`edge-fade edge-fade-left ticker-${position}`} />
			<div className={`edge-fade edge-fade-right ticker-${position}`} />
		</div>
	);
}

export default App;
