export const kpi = {
  today: 920,
  target: 1000,
  efficiency: 92,
  utilization: 94.2,
  downtime: 45,
  defectRate: 2.1,
  activeOrders: 328,
  criticalAlerts: 3,
};

export type MachineStatus = "running" | "warning" | "maintenance" | "offline";

export interface Machine {
  id: string;
  name: string;
  status: MachineStatus;
  temp: number;
  efficiency: number;
  health: number;
  downtime: number;
  runtime: string;
  lastMaint: string;
}

export const machines: Machine[] = [
  { id: "M-01", name: "CNC Mill A", status: "running", temp: 72, efficiency: 94, health: 96, downtime: 0, runtime: "14h 20m", lastMaint: "2d ago" },
  { id: "M-02", name: "Lathe B", status: "running", temp: 68, efficiency: 91, health: 93, downtime: 12, runtime: "12h 45m", lastMaint: "5d ago" },
  { id: "M-03", name: "Press C", status: "maintenance", temp: 45, efficiency: 0, health: 100, downtime: 180, runtime: "0h", lastMaint: "Today" },
  { id: "M-04", name: "Welder D", status: "warning", temp: 87, efficiency: 78, health: 72, downtime: 45, runtime: "10h 15m", lastMaint: "12d ago" },
  { id: "M-05", name: "Robot Arm E", status: "running", temp: 75, efficiency: 89, health: 88, downtime: 20, runtime: "13h 50m", lastMaint: "3d ago" },
  { id: "M-06", name: "Conveyor F", status: "running", temp: 70, efficiency: 93, health: 95, downtime: 5, runtime: "14h 05m", lastMaint: "6d ago" },
  { id: "M-07", name: "Laser Cutter G", status: "running", temp: 66, efficiency: 90, health: 91, downtime: 10, runtime: "12h 30m", lastMaint: "4d ago" },
  { id: "M-12", name: "Welding Arm E5", status: "warning", temp: 87, efficiency: 78, health: 72, downtime: 45, runtime: "9h 30m", lastMaint: "14d ago" },
];

export const productionLines = [
  { name: "Line 1", target: 1250, actual: 1190, status: "Running" },
  { name: "Line 2", target: 980, actual: 920, status: "Running" },
  { name: "Line 3", target: 1100, actual: 780, status: "Warning" },
  { name: "Line 4", target: 1320, actual: 1310, status: "Running" },
];

export const shifts = [
  { shift: "Morning", output: 320, efficiency: 94, status: "Completed" },
  { shift: "Afternoon", output: 310, efficiency: 92, status: "In Progress" },
  { shift: "Night", output: 0, efficiency: 0, status: "Upcoming" },
];

export interface Order {
  id: string;
  customer: string;
  product: string;
  qty: number;
  progress: number;
  deadline: string;
  risk: "High" | "Medium" | "Low";
  status: "On Track" | "At Risk" | "Delayed" | "Completed";
}

export const orders: Order[] = [
  { id: "1042", customer: "Apex Manufacturing", product: "Industrial Valve", qty: 500, progress: 74, deadline: "Today", risk: "High", status: "At Risk" },
  { id: "1048", customer: "Northfield Steel", product: "Steel Sheet 4mm", qty: 1200, progress: 91, deadline: "Tomorrow", risk: "Low", status: "On Track" },
  { id: "1051", customer: "Delta Components", product: "Hydraulic Pump", qty: 300, progress: 30, deadline: "3 Days", risk: "Medium", status: "Delayed" },
  { id: "1055", customer: "Apex Manufacturing", product: "Gear Assembly", qty: 800, progress: 60, deadline: "2 Days", risk: "Medium", status: "On Track" },
  { id: "1058", customer: "Orion Robotics", product: "Servo Bracket", qty: 450, progress: 100, deadline: "Done", risk: "Low", status: "Completed" },
];

export const alerts = [
  { level: "CRITICAL", title: "Machine M-12 temperature above normal", desc: "87°C detected — 12°C over safe operating range.", time: "2 min ago", action: "Inspect cooling" },
  { level: "WARNING", title: "Steel Sheet inventory below threshold", desc: "Current stock 320 units — reorder recommended.", time: "15 min ago", action: "Purchase" },
  { level: "WARNING", title: "Order #1042 has high delay risk", desc: "Only 74% complete with deadline today.", time: "35 min ago", action: "Reallocate" },
  { level: "INFO", title: "Maintenance scheduled for Machine M-07", desc: "Routine inspection tomorrow at 09:00.", time: "1 hr ago", action: "Confirm" },
];

export const inventory = [
  { material: "Steel Sheet 4mm", category: "Raw Material", stock: 320, min: 400, supplier: "Nordic Steel", status: "Reorder Recommended" },
  { material: "Hydraulic Fluid", category: "Consumable", stock: 890, min: 300, supplier: "LubriTech", status: "Good" },
  { material: "Titanium Rod 8mm", category: "Raw Material", stock: 120, min: 150, supplier: "AeroMetals", status: "Critical" },
  { material: "Aluminum Plate 6mm", category: "Raw Material", stock: 640, min: 350, supplier: "Nordic Steel", status: "Good" },
  { material: "Bearing 6204", category: "Component", stock: 210, min: 250, supplier: "SKF Direct", status: "Reorder Recommended" },
];

export const maintenance = [
  { machine: "M-12", issue: "Overheating / Cooling inspection", priority: "Critical", date: "Today 14:00", tech: "J. Rivera", status: "Scheduled" },
  { machine: "M-04", issue: "Efficiency drop / Belt replacement", priority: "High", date: "Tomorrow 09:00", tech: "S. Lee", status: "Scheduled" },
  { machine: "M-07", issue: "Routine inspection", priority: "Medium", date: "Tomorrow 09:00", tech: "A. Patel", status: "Scheduled" },
  { machine: "M-02", issue: "Lubrication cycle", priority: "Low", date: "Fri 16:00", tech: "S. Lee", status: "Completed" },
];

export const workers = [
  { name: "Maria Lopez", role: "Line Supervisor", shift: "Morning", attendance: "Present", prod: 92, status: "Active" },
  { name: "Jamal Carter", role: "Machine Operator", shift: "Afternoon", attendance: "Present", prod: 88, status: "Active" },
  { name: "Sarah Kim", role: "Quality Inspector", shift: "Night", attendance: "Present", prod: 95, status: "Active" },
  { name: "David Park", role: "Maintenance Tech", shift: "Morning", attendance: "Off", prod: 0, status: "Off" },
  { name: "Elena Novak", role: "Robot Programmer", shift: "Morning", attendance: "Present", prod: 97, status: "Active" },
];

export const productionWeek = [
  { day: "Mon", output: 820, target: 1000 },
  { day: "Tue", output: 910, target: 1000 },
  { day: "Wed", output: 880, target: 1000 },
  { day: "Thu", output: 1020, target: 1000 },
  { day: "Fri", output: 920, target: 1000 },
  { day: "Sat", output: 760, target: 800 },
  { day: "Sun", output: 680, target: 800 },
];

export const defectTrend = [
  { week: "W1", defects: 34, rate: 3.4 },
  { week: "W2", defects: 28, rate: 2.9 },
  { week: "W3", defects: 31, rate: 3.1 },
  { week: "W4", defects: 22, rate: 2.4 },
  { week: "W5", defects: 25, rate: 2.6 },
  { week: "W6", defects: 18, rate: 2.1 },
];

export const energyData = [
  { time: "06:00", electricity: 210, gas: 90 },
  { time: "08:00", electricity: 340, gas: 140 },
  { time: "10:00", electricity: 420, gas: 170 },
  { time: "12:00", electricity: 380, gas: 150 },
  { time: "14:00", electricity: 450, gas: 180 },
  { time: "16:00", electricity: 400, gas: 160 },
  { time: "18:00", electricity: 260, gas: 110 },
];

export const defectTypes = [
  { type: "Surface Defect", pct: 42 },
  { type: "Dimensional Error", pct: 28 },
  { type: "Assembly Error", pct: 18 },
  { type: "Material Defect", pct: 12 },
];
