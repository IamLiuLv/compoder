import React from "react"
import { cn } from "@/lib/utils"
import { MonitorSmartphone, Fullscreen, PlugZap } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Device type definitions
interface DevicePreset {
  id: string
  label: string
  width: string
  height: string
}

interface DeviceCategory {
  category: string
  devices: DevicePreset[]
}

type PresetItem = DevicePreset | DeviceCategory

// Available device presets for responsive mode
const DEVICE_PRESETS: PresetItem[] = [
  { id: "desktop", label: "Desktop", width: "100%", height: "100%" },
  { id: "responsive", label: "Responsive", width: "auto", height: "auto" },
  {
    category: "Mobile",
    devices: [
      { id: "iphone-se", label: "iPhone SE", width: "375px", height: "667px" },
      { id: "iphone-xr", label: "iPhone XR", width: "414px", height: "896px" },
      { id: "iphone-12", label: "iPhone 12", width: "390px", height: "844px" },
      { id: "iphone-14", label: "iPhone 14", width: "393px", height: "852px" },
      {
        id: "iphone-14-pro-max",
        label: "iPhone 14 Pro Max",
        width: "430px",
        height: "932px",
      },
      {
        id: "pixel-5",
        label: "Google Pixel 5",
        width: "393px",
        height: "851px",
      },
      {
        id: "samsung-s20",
        label: "Samsung S20",
        width: "360px",
        height: "800px",
      },
    ],
  },
  {
    category: "Tablet",
    devices: [
      { id: "ipad-mini", label: "iPad Mini", width: "768px", height: "1024px" },
      { id: "ipad-air", label: "iPad Air", width: "820px", height: "1180px" },
      {
        id: "ipad-pro",
        label: 'iPad Pro 11"',
        width: "834px",
        height: "1194px",
      },
      {
        id: "ipad-pro-12",
        label: 'iPad Pro 12.9"',
        width: "1024px",
        height: "1366px",
      },
      {
        id: "surface-pro",
        label: "Surface Pro",
        width: "912px",
        height: "1368px",
      },
    ],
  },
  {
    category: "Laptop",
    devices: [
      {
        id: "macbook-air",
        label: "MacBook Air",
        width: "1280px",
        height: "800px",
      },
      {
        id: "macbook-pro",
        label: "MacBook Pro",
        width: "1440px",
        height: "900px",
      },
    ],
  },
]

// Type guard to check if a preset item is a device category
const isDeviceCategory = (item: PresetItem): item is DeviceCategory => {
  return "category" in item && Array.isArray((item as DeviceCategory).devices)
}

interface ControlBarProps {
  onToggleFullscreen: () => void
  isFullscreen: boolean
  onChangeDevice: (width: string, height: string, deviceId: string) => void
  currentDevice: string
  className?: string
  codeRendererServer?: string
}

export const ControlBar: React.FC<ControlBarProps> = ({
  onToggleFullscreen,
  isFullscreen,
  onChangeDevice,
  currentDevice,
  className,
  codeRendererServer,
}) => {
  // Find device by ID
  const findDeviceById = (id: string): DevicePreset | undefined => {
    return DEVICE_PRESETS.flatMap(item =>
      isDeviceCategory(item) ? item.devices : [item as DevicePreset],
    ).find(d => d.id === id)
  }

  // Get current device label
  const getCurrentDeviceLabel = () => {
    if (currentDevice === "desktop") return "Desktop"
    if (currentDevice === "responsive") return "Responsive"

    const device = findDeviceById(currentDevice)
    return device?.label || "Custom"
  }

  // Get device dimensions for display
  const getCurrentDeviceDimensions = () => {
    if (currentDevice === "desktop" || currentDevice === "responsive")
      return null

    const device = findDeviceById(currentDevice)
    if (!device) return null

    return `${device.width.replace("px", "")} × ${device.height.replace(
      "px",
      "",
    )}`
  }

  const deviceDimensions = getCurrentDeviceDimensions()

  // 解析服务器地址获取端口和路径
  const getServerInfo = () => {
    if (!codeRendererServer) return { host: "", port: "", path: "/" }

    try {
      const url = new URL(codeRendererServer)
      // 如果是默认端口(443, 80)且URL中没有显式指定，使用5173作为默认端口显示
      const displayPort = url.port ? url.port : ""
      // 保留完整路径，包括协议和主机名
      const fullPath = codeRendererServer
      return {
        host: url.hostname,
        port: displayPort,
        path: url.pathname || "/",
        fullPath,
      }
    } catch (e) {
      console.error("Failed to parse code renderer server:", e)
      return {
        host: codeRendererServer,
        port: "",
        path: "/",
        fullPath: codeRendererServer,
      }
    }
  }

  const serverInfo = getServerInfo()

  return (
    <TooltipProvider>
      <div
        className={cn(
          "flex items-center justify-between h-10 px-2 border-b border-border bg-card/80 backdrop-blur-sm",
          className,
        )}
      >
        {/* 左侧显示服务器地址 */}
        <div className="flex items-center flex-1 mx-2">
          {codeRendererServer && (
            <div className="group flex items-center gap-1 w-full bg-muted/20 border border-border text-muted-foreground rounded-full pl-1 py-0.5 pr-2 text-sm hover:bg-muted/30 hover:focus-within:bg-muted/40 focus-within:bg-muted/40 focus-within:border-primary/30 focus-within:text-foreground">
              <div className="flex gap-1.5 w-full items-center min-w-0">
                <div className="relative grid flex-shrink-0">
                  <button className="flex items-center bg-white dark:bg-muted/80 group-focus-within:text-muted-foreground group-hover:bg-background/90 group-focus-within:bg-background rounded-full px-2 py-0.5 gap-1">
                    <PlugZap className="h-3.5 w-3.5" />
                    <div className="text-xs font-medium">{serverInfo.port}</div>
                  </button>
                </div>
                <div className="flex-1 min-w-0">
                  <input
                    className="w-full bg-transparent outline-none text-xs overflow-hidden text-ellipsis whitespace-nowrap"
                    type="text"
                    value={serverInfo.fullPath}
                    readOnly
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 右侧操作按钮 */}
        <div className="flex items-center flex-shrink-0">
          {/* Device selection dropdown */}
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "p-1 text-muted-foreground hover:bg-muted/30 hover:text-foreground",
                      currentDevice !== "desktop" && "text-primary",
                    )}
                  >
                    <MonitorSmartphone className="h-4 w-4" />
                    {deviceDimensions && (
                      <span className="text-muted-foreground text-[10px] ml-1">
                        {deviceDimensions}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <span>{getCurrentDeviceLabel()}</span>
              </TooltipContent>
            </Tooltip>
            <DropdownMenuContent
              align="end"
              className="w-56 max-h-[400px] overflow-y-auto"
            >
              {/* Desktop and responsive options */}
              {DEVICE_PRESETS.slice(0, 2).map(item => {
                const device = item as DevicePreset
                return (
                  <DropdownMenuItem
                    key={device.id}
                    onClick={() =>
                      onChangeDevice(device.width, device.height, device.id)
                    }
                    className={cn(
                      currentDevice === device.id &&
                        "bg-accent text-accent-foreground",
                    )}
                  >
                    <span>{device.label}</span>
                    {device.id === "responsive" && (
                      <span className="text-muted-foreground text-[10px] ml-auto">
                        Freely resizable
                      </span>
                    )}
                  </DropdownMenuItem>
                )
              })}

              {/* Device categories */}
              {DEVICE_PRESETS.slice(2).map((category, idx) => {
                if (!isDeviceCategory(category)) return null

                return (
                  <React.Fragment key={`category-${idx}`}>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
                      {category.category}
                    </DropdownMenuLabel>
                    {category.devices.map(device => (
                      <DropdownMenuItem
                        key={device.id}
                        onClick={() =>
                          onChangeDevice(device.width, device.height, device.id)
                        }
                        className={cn(
                          currentDevice === device.id &&
                            "bg-accent text-accent-foreground",
                        )}
                      >
                        <span>{device.label}</span>
                        <span className="text-muted-foreground text-[10px] ml-auto">
                          {device.width.replace("px", "")}
                        </span>
                      </DropdownMenuItem>
                    ))}
                  </React.Fragment>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="w-px h-5 mx-2 bg-border" />

          {/* Fullscreen button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleFullscreen}
                className="p-1 text-muted-foreground hover:bg-muted/30 hover:text-foreground"
              >
                <Fullscreen className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <span>{isFullscreen ? "Exit Fullscreen" : "Fullscreen"}</span>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  )
}
