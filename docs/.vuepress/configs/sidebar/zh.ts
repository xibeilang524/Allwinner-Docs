import type { SidebarConfig } from '@vuepress/theme-default'

export const sidebarZh: SidebarConfig = {
  '/': [
    {
      text: 'Linux基础命令',
      children: [
        '/Basic/LinuxShell/Filemanagement.md',
        '/Basic/LinuxShell/NetworkManagement.md',
        '/Basic/LinuxShell/SystemManagement.md',
        '/Basic/LinuxShell/DocumentEditing.md',
        '/Basic/LinuxShell/DiskOperation.md',

      ],
    },
    {
      text: 'MakeFile',
      collapsible: true,
      children: [
        '/Basic/MakeFile/01-Introduction.md',
        '/Basic/MakeFile/03-variable.md',
        '/Basic/MakeFile/04-Pattern_rules_pseudo-targets.md',
        '/Basic/MakeFile/05-function.md',
        '/Basic/MakeFile/06-examples.md',
      ],
    },
    {
      text: 'C基础知识',
      collapsible: true,
      children: [
        '/Basic/GCCManual/01-Introduction.md',
      ],
    },
    {
      text: 'GNU工具',
      collapsible: true,
      children: [
        '/Basic/GNU/01-Introduction.md',
      ],
    },
  ],
  '/Application/': [
    {
      text: '开发板使用',
      children: [
        '/Application/Board/100ASK_T113-PRO/01-BoardIntroduction.md',
        '/Application/Board/100ASK_T113-PRO/02-SupportingResources.md',
        '/Application/Board/100ASK_T113-PRO/03-QuickStart.md',
        '/Application/Board/100ASK_T113-PRO/04-StudyPath.md',
        '/Application/Board/100ASK_T113-PRO/05-1_RunHelloword.md',
        '/Application/Board/100ASK_T113-PRO/05-2_RunHellowordDriver.md',
        '/Application/Board/100ASK_T113-PRO/06-ConfigHostEnv.md',
        '/Application/Board/100ASK_T113-PRO/07-Buildroot-SDK_DevelopmentGuide.md',
        '/Application/Board/100ASK_T113-PRO/08-BuildBootloader.md',
        '/Application/Board/100ASK_T113-PRO/09-BuildLinuxKernel.md',
        '/Application/Board/100ASK_T113-PRO/10-1_BuildrootSupportWifiBluetooth.md',
        '/Application/Board/100ASK_T113-PRO/10-BuildRootfs.md',
        '/Application/Board/100ASK_T113-PRO/11-Tina-SDK_DevelopmentGuide.md',
      ],
    },
    {
      text: '显示开发',
      collapsible: true,
      children: [
        '/Application/GraphicLibrariesAndApplications/LVGL8/01-Introduction.md',
      ],
    },
    {
      text: '网络开发',
      collapsible: true,
      children: [
        '/Application/02_ImageProcess.md',
      ],
    },
    {
      text: '模块开发',
      collapsible: true,
      children: [
        '/Application/02_ImageProcess.md',
      ],
    },
  ],
  '/System/': [
    {
      text: 'Linux系统组成',
      children: [
        '/System/systemfunction.md',
      ],
    },
    {
      text: 'Tina-SDK使用',
      collapsible: true,
      children: [
        '/System/Linux_SystemSoftware_DevelopmentGuide.md',
        '/System/Linux_Packaging_Process_DescriptionGuide.md',
      ],
    },
    {
      text: '系统定制化',
      collapsible: true,
      children: [
        '/System/Linux_OTA_DevelopmentGuide.md',
      ],
    },
  ],
  '/Devicedriver/': [
    {
      text: 'GPIO子系统',
      collapsible: true,
      children: [
        '/Devicedriver/Linux_GPIO_DevelopmentGuide-01.md',
        '/Devicedriver/Linux_GPIO_DevelopmentGuide-02.md',
        '/Devicedriver/Linux_GPIO_DevelopmentGuide-03.md',
        '/Devicedriver/Linux_GPIO_DevelopmentGuide-04.md',
        '/Devicedriver/Linux_GPIO_DevelopmentGuide-05.md',
        '/Devicedriver/Linux_GPIO_DevelopmentGuide-06.md',
      ],
    },
    {
      text: '网络子系统',
      collapsible: true,
      children: [
        '/Devicedriver/02_ImageProcess.md',
      ],
    },
    {
      text: '显示子系统',
      collapsible: true,
      children: [
        '/Devicedriver/Linux_Camera_DevelopmentGuide-01.md',
      ],
    },
    {
      text: '多媒体子系统',
      collapsible: true,
      children: [
        '/Devicedriver/Linux_Camera_DevelopmentGuide-01.md',
      ],
    },
    {
      text: '存储设备子系统',
      collapsible: true,
      children: [
        '/Devicedriver/Linux_Camera_DevelopmentGuide-01.md',
      ],
    },
  ],
  '/Special/': [
    {
      text: 'Buildroot-LTS专题',
      collapsible: true,
      children: [
        '/Special/02_ImageProcess.md',
      ],
    },
    {
      text: '支持主线Linux',
      collapsible: true,
      children: [
        '/Special/02_ImageProcess.md',
      ],
    },
    {
      text: 'Bootloader开发',
      collapsible: true,
      children: [
        '/Special/Linux_U-boot_DevelopmentGuide-01.md',
        '/Special/Linux_U-boot_DevelopmentGuide-02.md',
        '/Special/Linux_U-boot_DevelopmentGuide-03.md',
        '/Special/Linux_U-boot_DevelopmentGuide-04.md',
        '/Special/Linux_U-boot_DevelopmentGuide-05.md',
        '/Special/Linux_U-boot_DevelopmentGuide-06.md',
      ],
    },
  ],
}
