# 打包流程分析

## 1.1 编写目的

介绍Allwinner 平台上打包流程。

## 1.2 适用范围

Allwinner 软件平台Tina v3.0 版本以上。

## 1.3 相关人员

适用Tina 平台的广大客户，想了解Tina 打包流程的开发人员。

# 2 固件打包简介

固件打包是指将我们编译出来的bootloader、内核和根文件系统一起写到一个镜像文件中，这个镜像文件也叫固件。然后可以将这个镜像写到nand、nor flash 或是sd 卡上，从而启动系统。打包成固件时需要使用到一些打包工具，打包脚本以及打包配置文件。本文主要就是介绍打包时需要哪些工具，需要哪些配置文件，以及固件的生成流程。

# 3 打包工具介绍

本文只介绍Tina 打包时特有的工具，其他通用工具如unix2dos 等请自行百度。在tina SDK 中特有的打包工具保存在如下路径：

```
tina/tools/pack-bintools/src
```

## 3.1 update_mbr

| 工具名称 | update_mbr                                                   |
| -------- | ------------------------------------------------------------ |
| 功能说明 | 根据分区配置文件，更新主引导目录文件sunxi_mbr.fex ，sunxi_gpt.fex<br/>及分区的下载文件列表dlinfo.fex 。 |
| 使用方法 | update_mbr <partition_file> (mbr_count)<br/>如果不指定mbr_count，mbr_count = 4;<br/>update_mbr <partition_file> <mbr_countnt> <output_name><br/>使用此用法必须指定mbr_count，本来输出的sunxi_mbr.fex 会改名为output_name。 |
| 参数说明 | partition_file：分区配置文件，如sys_partition.bin<br/>mbr_count：mbr 的备份数量，如果不指定，缺省mbr_count = 4;<br/>output_name：修改sunxi_mbr.fex 的输出名，没有特殊需求不建议使用此用法。 |
| 应用举例 | update_mbr sys_partition.bin 4<br/>update_mbr sys_partition.bin 1 sunxi_mbr_tmp.fex<br/>（没有特殊需求不建议使用此用法） |

## 3.2 merge_full_img

| 工具名称 | merge_full_img                                               |
| -------- | ------------------------------------------------------------ |
| 功能说明 | 指定起始逻辑地址，把boot0，boot1，mbr 及分区文件下载列表里的文件合<br/>并成img 固件包，应用于小容量的nor flash。此时没有分区的概念。 |
| 使用方法 | merge_full_img –out <outfile> <br/>–boot0 <boot0.fex> <br/>–boot1 <boot1.fex> <br/>–mbr <mbr.fex> <br/>–partition <partition.fex> \–logic_start <512\|256>–help |

| 参数说明 | –out <outfile>：指定输出目标文件<br/>–boot0 <boot0.fex>：指定输入的boot0 文件–boot1 <boot1.fex>：指定输入的boot1 文件<br/>–mbr <mbr.fex>：指定输入的mbr 文件–partition <partition.fex>：指定输入的分区配置文件
–logic_start <512\|256>：指定起始逻辑地址
–help：显示使用方法 |
| 应用举例 | merge_full_img –out full_img.fex \<br/>–boot0 boot0_spinor.fex \<br/>–boot1 ${BOOT1_FILE} \<br/>–mbr sunxi_mbr.fex \<br/>–logic_start ${LOGIC_START} \<br/>–partition_file |

## 3.3 script

(1) 注意: 此处讲述的不是Linux 通用的script 工具（Linux 下script 工具用于终端会话录制）
(2) 它是全志实现的一个同名工具，工具功能说明如下：

| 工具名称 | script                                                       |
| -------- | ------------------------------------------------------------ |
| 功能说明 | 解析输入文本文件的所有数据项，生成新的二进制bin 文件，以便程序解析。生成的目标文件与源文件名字(除后缀) 一样，但后缀为.bin。 |
| 使用方法 | script <source_file>                                         |
| 参数说明 | source_file：输入的文本文件，可多个                          |
| 应用举例 | scriptsys_config.fex<br/>scriptsys_partition.fex             |

## 3.4 dragonsecboot

| 工具名称 | dragonsecboot                                                |
| -------- | ------------------------------------------------------------ |
| 功能说明 | 1) 根据指定的keys 生成toc0 文件。<br/>2) 根据指定的keys 和cnfbase 生成toc1 文件。<br/>3) 根据配置文件生成keys。<br/>4) 按配置文件的配置进行打包生成目的文件。 |
| 使用方法 | dragonsecboot -toc0 <cfg_file> <keypath> <version_file><br/>dragonsecboot -toc1 <cfg_file> <keypath> <cnfbase> <version_file><br/>dragonsecboot -key <cfg_file> <keypath><br/>dragonsecboot -pack <cfg_file> |
| 参数说明 | -toc0：表示要生成toc0 文件<br/>-toc1：表示要生成toc1 文件<br/>-key：表示要生成key<br/>-pack：表示进行打包<br/>cfg_file：配置文件<br/>keypath：key 的路径<br/>cnfbase：输入的cnf_base.cnf 文件<br/>version_file：固件防回滚配置文件 |
| 应用举例 | dragonsecboot -pack boot_package.cfg<br/>dragonsecboot -key dragon_toc.cfg keys<br/>dragonsecboot -toc0 dragon_toc.cfg keys version_base.mk<br/>dragonsecboot -toc1 dragon_toc.cfg keys cnf_base.cnf version_base.mk |

## 3.5 update_boot0

| 工具名称 | update_boot0                                                 |
| -------- | ------------------------------------------------------------ |
| 功能说明 | 根据配置脚本内容，修正boot0 头部的参数。修正参数：debug_mode、<br/>dram_para 参数、uart 参数、bootcpu、jtag 参数、NAND 参数等。 |
| 使用方法 | update_boot0 <boot0> <sys_config_file> <storage_type>        |
| 参数说明 | boot0：boot0 文件<br/>sys_config_file：系统配置文件storage_type：存储介质类型 |
| 应用举例 | update_boot0 boot0_nand.fex sys_config.bin NAND<br/>update_boot0 boot0_sdcard.fex sys_config.bin SDMMC_CARD<br/>update_boot0 boot0_spinor.fex sys_config.bin SDMMC_CARD |

## 3.6 update_dtb

| 工具名称 | update_dtb                                                   |
| -------- | ------------------------------------------------------------ |
| 功能说明 | 把Linux 设备树二进制dtb 文件进行512 字节对齐后再预留空间。   |
| 使用方法 | update_dtb <dtb_file> <reserve_size>                         |
| 参数说明 | dtb_file：输入的Linux 设备树二进制dtb 文件reserve_size：输出目标文件预留多少字节 |
| 应用举例 | update_dtb sunxi.fex 4096                                    |

## 3.7 update_fes1

| 工具名称 | update_fes1                                                  |
| -------- | ------------------------------------------------------------ |
| 功能说明 | 从系统配置文件中取出数据对fes1 头部相关参数进行修正。<br/>修正参数包括：DRAM 参数、UART 参数、JTAG 参数等。 |
| 使用方法 | update_fes1 <fes1_file> <config_file>                        |
| 参数说明 | fes1_file：更修正的FES1 文件<br/>config_file：输入的系统配置文件 |
| 应用举例 | update_fes1 fes1.fex sys_config.bin                          |

## 3.8 signature

| 工具名称 | signature                                                    |
| -------- | ------------------------------------------------------------ |
| 功能说明 | 对MBR 指定要进行签名的分区文件进行签名。                     |
| 使用方法 | signature <sunxi_mbr_file> <dlinfo_file>                     |
| 参数说明 | sunxi_mbr_file：输入的MBR 文件<br/>dlinfo_file：输入的分区下载列表文件 |
| 应用举例 | signature sunxi_mbr.fex dlinfo.fex                           |

## 3.9 update_toc0

| 工具名称 | update_toc0                                                  |
| -------- | ------------------------------------------------------------ |
| 功能说明 | 从系统配置文件中取出相关参数对toc0 配置参数进行修正，修正参数包括：<br/>DRAM、UART、JTAG、NAND、卡0 、卡2 、secure 参数等。 |
| 使用方法 | update_toc0 <toc0_file> <config_file>                        |
| 参数说明 | toc0_file：输入的toc0 文件<br/>config_file：输入的系统配置文件 |
| 应用举例 | update_toc0 toc0.fex sys_config.bin                          |

## 3.10 update_uboot

| 工具名称 | update_uboot                                                 |
| -------- | ------------------------------------------------------------ |
| 功能说明 | 从系统配置文件中取出相关参数对uboot 头部参数进行修正。<br/>修正参数包括：UART 参数、TWI 参数、target 参数、SDCARD 参数等。 |
| 使用方法 | update_uboot <uboot_file> <config_file><br/>update_uboot -merge <uboot_file> <config_file><br/>update_uboot -no_merge <uboot_file> <config_file> |
| 参数说明 | uboot_file：要更新的uboot 文件<br/>config_file：系统配置文件<br/>-merge：系统配置文件会拼接在uboot 文件尾部<br/>-no_merge：系统配置文件不会拼接在uboot 文件尾部注意：没有显式指明-no_merge 参数默认会把系统配置文件拼接在uboot 文件尾部 |
| 应用举例 | update_uboot u-boot.fex sys_config.bin<br/>update_uboot -merge u-boot.fex sys_config.bin<br/>update_uboot -no_merge u-boot.fex sys_config.bin |



## 3.11 update_scp

| 工具名称 | update_scp                                                   |
| -------- | ------------------------------------------------------------ |
| 功能说明 | 从系统配置文件中取出相关参数对scp （小cpu 运行代码只有带有小cpu 方案的芯片<br/>会用到）头部参数进行修正。修正参数包括：UART 参数、dram_para 参数等。 |
| 使用方法 | update_scp <scp_file> <config_file>                          |
| 参数说明 | uboot_file：要更新的scp 文件<br/>config_file：系统配置文件   |
| 应用举例 | update_scp scp.fex sunxi.fex                                 |

## 3.12 u_boot_env_gen

| 工具名称 | u_boot_env_gen                                               |
| -------- | ------------------------------------------------------------ |
| 功能说明 | 解析env 文件生成uboot 能识别的env 二进制数据文件，功能与标准的mkenvimage<br/>工具类似。 |
| 使用方法 | u_boot_env_gen <env_file> <env_bin_file>                     |
| 参数说明 | env_file：输入的evn 文件<br/>env_bin_file：输出的env 二进制文件 |
| 应用举例 | u_boot_env_gen env.cfg env.fex                               |

## 3.13 fsbuild

| 工具名称 | fsbuild                                                      |
| -------- | ------------------------------------------------------------ |
| 功能说明 | 根据boot-resource.ini 生成fat 格式文件。                     |
| 使用方法 | fsbuild <rootfs_config_file> <magic_file>                    |
| 参数说明 | rootfs_config_file：fat 系统配置文件<br/>magic：用于fat 文件系统校验 |
| 应用举例 | fsbuild boot-resource.ini split_xxxx.fex                     |

## 3.14 update_toc1（旧版本工具，后面会弃用，可以不理会

| 工具名称 | update_toc1                                                  |
| -------- | ------------------------------------------------------------ |
| 功能说明 | 从系统配置文件中取出相关参数对toc1 配置参数进行修正，修正参数包括：<br/>board_id_simple_gpio 参数（需配置启用，目前已没有方案使用）。 |
| 使用方法 | update_toc1 <toc1_file> <config_file>                        |
| 参数说明 | toc1_file：输入的toc1 文件<br/>config_file：输入的系统配置文件 |
| 应用举例 | update_toc1 toc1.fex sys_config.bin                          |

## 3.15 programmer_img

| 工具名称 | programmer_img                                               |
| -------- | ------------------------------------------------------------ |
| 功能说明 | 生成mmc 介质的烧录固件。                                     |
| 使用方法 | programmer_img <boot0_file> <uboot_file> <out_img><br/>programmer_img <partition file> <mbr_file> <out_img> <in_img> |
| 参数说明 | in_img：输入的文件或镜像<br/>boot0_file：boot0 文件<br/>uboot_file：uboot 文件<br/>partition_file：分区配置文件<br/>mbr_file：sunxi_mbr 文件output_img：输出的文件或镜像 |
| 应用举例 | programmer_img boot0_sdcard.fex boot_package.fex ${out_img}<br/>programmer_img sys_partition.bin sunxi_mbr.fex ${out_img} ${in_img} |

## 3.16 dragon

| 工具名称 | dragon                                                       |
| -------- | ------------------------------------------------------------ |
| 功能说明 | 根据img 配置文件和分区配置文件生成固件。                     |
| 使用方法 | dragon <img_config> <partition_file>                         |
| 参数说明 | img_config：配置文件，描述img 文件格式和包含其他文件列表<br/>partition_file：分区配置文件 |
| 应用举例 | dragon image.cfg sys_partition.fex                           |

## 3.17 sigbootimg

| 工具名称 | sigbootimg                                                   |
| -------- | ------------------------------------------------------------ |
| 功能说明 | 在输入文件的后面添加一个证书，并输出一个带证书的文件。       |
| 使用方法 | sigbootimg –image <input_img> –cert <cert_file> –output <output_img> |
| 参数说明 | input_img：输入的文件或镜像<br/>cert_file：文件或镜像对应的证书<br/>output_img：带证书的文件或镜像 |
| 应用举例 | sigbootimg –image boot.fex –cert boot.fex –output boot_sig.fex |
# 4 打包脚本分析

## 4.1 脚本的调用流程

在Tina 主目录下执行make -j16 编译完成后便可以执行pack 进行打包工作，整个打包过程大概如下图所示：

![image-20230104103604851](https://cdn.staticaly.com/gh/DongshanPI/Docs-Photos@master/Tina-Sdk/Linux_Packflow_DevGuide_image-20230104103604851.png)

结合上面的打包流程图分析，打包方法在Tina SDK 根目录下运行：

```
pack
```

最终打包出来的固件放在目录tina/out/platform−{board}/下。pack 命令实质上是tina SDK 内置的一个环境变量命令。

在使用tina SDK 时需要执行source build/envsetup.sh 这个命令。这个命令是把tina SDK 实现的一些shell 命令export 到当前shell 中。
打开build/envsetup.sh 脚本，可以发现里面实现了一个shell 函数：

```
function pack()
```

在tina 根目录下执行pack 命令后调用到的就是build/envsetup.sh 脚本中的function pack()函数，function pack() 函数进行一些参数设置后最终调用到以下语句：

```
$T/scripts/pack_img.sh -c $chip -p $platform -b $board -d $debug -s $sigmode -m $mode -w
$programmer -v $securemode -i $tar_image -t $T
-c：输入的芯片类型例如：sun8iw18p1
-p：输入的平台例如：tina
-b：输入的板级方案例如：r328s2-perf1
-d：输入调试时log输入方式例如：uart0/card0
-s：输入是否打包成安全固件例如：none/secure
-m：输入是正常固件还是调试用的dump固件：normal/dump
-w：
-v：输入打包时是否使用安全boot，对于tinaSDK来说该参数功能已由-s替代，参数只是历史遗留或做兼容用，客户可以不
用理会该参数
-i：输入是否制作压缩包none/tar_image，调试时用，客户可以不用理会该参数
-t：Tina根目录的路径
```

从上面可以看出function pack() 函数最终调用到tina/scripts/pack_img.sh 这个脚本文件，这个脚本文件实现了打包的最终流程。
目前打包脚本主要分为5 个阶段（其他阶段都是一些特殊化处理），分别是：

```
do_prepare
do_ini_to_dts
do_common
do_pack_tina
do_finish
```



## 4.2 打包的各阶段分析

### 4.2.1 do_prepare 阶段

此阶段完成文件拷贝动作。打包时需要拷贝若干文件到tina/out/xxxplatform/image 目录下，目前脚本对其进行了分类，分别是tools_file_list，configs_file_list，boot_resource_list 和boot_file_list，boot_file_secure，a64_boot_file_secure 如有新增文件，可以归入其中一类或者创建新类，后续打包会使用到这些文件。

```c
function do_prepare()
{
......
#拷贝tools_file_list 类文件到tina/out/xxxplatform/image 目录下
printf "copying tools file\n"
for file in ${tools_file_list[@]} ; do
cp -f $file ${ROOT_DIR}/image/ 2> /dev/null
done
......
#拷贝configs_file_list 类文件到tina/out/xxxplatform/image 目录下
printf "copying configs file\n"
for file in ${configs_file_list[@]} ; do
cp -f $file ${ROOT_DIR}/image/ 2> /dev/null
done
......
#拷贝boot_resource_list 类文件到tina/out/xxxplatform/image 目录下
printf "copying boot resource\n"
#根据不同的arm架构拷贝不同的boot_file_secure 类文件到tina/out/xxxplatform/image 目录下
#32位系统
printf "copying secure boot file\n"
for file in ${boot_file_secure[@]} ; do
cp -f `echo $file | awk -F: '{print $1}'` \
${ROOT_DIR}/`echo $file | awk -F: '{print $2}'`
done
#64位系统
printf "copying arm64 secure boot file\n"
for file in ${a64_boot_file_secure[@]} ; do
cp -f `echo $file | awk -F: '{print $1}'` \
${ROOT_DIR}/`echo $file | awk -F: '{print $2}'`
done
}
```

### 4.2.2 do_ini_to_dts 阶段

在linux-3.10，引入了linux 设备树的概念。此阶段主要是编译生成描述设备树的sunxi.dtb 文件。该文件在linux 内核启动过程中会被解析，根据该文件中设备列表进行加载各个外设的设备驱动模块。具体实现分析如下：

```c
function do_ini_to_dts()
{
if [ "x${PACK_KERN}" == "xlinux-3.4" ] ;
then return
fi
......
#根据不同的内核设置不同的参数，最后调用下的命令编译生成.dbt 文件
$DTC_COMPILER ${DTC_FLAGS} -O dtb -o ${ROOT_DIR}/image/sunxi{SUFFIX}.dtb \
-b 0\
-i $DTC_SRC_PATH\
-F $DTC_INI_FILE\
-d $DTC_DEP_FILE $DTC_SRC_FILE &int> /dev/null
if [ $? -ne 0 ]; then
pack_error "Conver script to dts failed" exit 1
fi
printf "Conver script to dts ok.\n"
......}
```

### 4.2.3 do_common 阶段

此阶段完成所有系统平台通用的文件解析，分区打包。具体实现分析如下。(代码顺序与脚本的不一致，主要是为了方便说明)，该阶段与存储介质、内核版本等有耦合。因此比较复杂，但主要包括下面的5 个阶段：
(1) 使用unix2dos 工具确保文本文件为dos 格式。
(2) 使用script 工具解析文本文件，生成对应的二进制文件，便于后续工具解析。
(3) 更新boot0,uboot,scp 的头部参数。
(4) 生成boot_package。
(5) 生成env 分区数据env.fex。
具体实现分析如下：

```c
function do_common()
{
busybox unix2dos sys_config.fex
busybox unix2dos sys_partition.fex
busybox unix2dos sys_partition_nor.fex
#使用script 程序解析文本文件sys_config.fex 和sys_partition.fex/sys_partition_nor.fex
#生成相应的二进制文件sys_config.bin 和sys_partition.bin 便于后续工具程序解析
script sys_config.fex > /dev/null
script sys_partition.fex > /dev/null
script sys_partition_nor.fex > /dev/null
#根据sys_config.bin 参数,取出DRAM,UART 等参数更新boot0 头部参数
update_boot0 boot0_nand.fex sys_config.bin NAND > /dev/null
update_boot0 boot0_sdcard.fex sys_config.bin SDMMC_CARD > /dev/null
#根据sys_config.bin 参数设置,更新uboot 头部参数
update_uboot u-boot.fex sys_config.bin > /dev/null
#根据sys_config.bin 参数设置,更新fes1.fex 参数
update_fes1 fes1.fex sys_config.bin > /dev/null
    #制作启动过程相关资源的分区镜像
fsbuildboot-resource.inisplit_xxxx.fex > /dev/null
#根据配置生成uboot 基本配置二进制文件env.fex
mkenvimage -r -p 0x00 -s ${env_size} -o env.fex env_burn.cfg
u_boot_env_gen env.cfg env.fex > /dev/null
#根据boot_package.cfg配置生成boot_package
echo "pack boot package"
busybox unix2dos boot_package.cfg
dragonsecboot -pack boot_package.cfg
}
```

### 4.2.4 do_pack_tina 阶段

此阶段完成当前系统平台特有的工作以及安全相关的工作，主要对内核文件，文件系统等进行软链接，以及安全件的签名和toc0 的生成。
具体实现分析如下：

```c
function do_pack_tina()
{
#软链接boot.fex，rootfs.fex
ln -s ${ROOT_DIR}/boot.img boot.fex
ln -s ${ROOT_DIR}/rootfs.img rootfs.fex
......
#如果需要打包成安全固件就会调用do_signature函数
do_signature
{
#生成toc0文件
dragonsecboot -toc0 dragon_toc.cfg ${ROOT_DIR}/keys ${ROOT_DIR}/image/version_base.
mk
#根据sys_config.bin 参数，取出DRAM，UART 等参数更新toc0 头部参数
update_toc0 toc0.fex sys_config.bin
......
#生成toc1文件
dragonsecboot -toc1 dragon_toc.cfg ${ROOT_DIR}/keys \
${CNF_BASE_FILE} \
${ROOT_DIR}/image/version_base.mk
#对内核进行签名
sigbootimg --image boot.fex --cert toc1/cert/boot.der --output boot_sig.fex
#根据sys_config.bin 参数，取出DRAM，UART 等参数更新toc1 头部参数
update_toc1 toc1.fex sys_config.bin
}
}
```

### 4.2.5 do_finish 阶段

此阶段根据指定的固件成员完成打包。具体实现分析如下：

```c
function do_finish()
{
......
#生成分区结构文件sunxi_mbr.fex 及分区下载文件列表文件dlinfo.fex
update_mbr sys_partition.bin 4 > /dev/null
#根据所列的成员文件及分区信息,组合完成打包
dragon image.cfg sys_partition.fex
......
}
```

## 4.3 打包过程数据流分析

上一章节讲述了打包脚本的几个阶段，本节我们换个视角看打包过程。打包过程是将编译好后的二进制镜像和各种配置文件，通过一些加工、转换和合成最终生成固件包。如下图所示，讲述了需要打包的各种文件在哪个位置，会经过如何处理，合成什么文件，最终生
成了固件包。

![image-20230104104015158](https://cdn.staticaly.com/gh/DongshanPI/Docs-Photos@master/Tina-Sdk/Linux_Packflow_DevGuide_image-20230104104015158.png)

其中蓝色的是源文件或者生成的中间文件；
绿色的是打包用到的工具；
红色的是最终生成的固件。
固件里面包含哪些文件，可以参考下一章节。
这里展示另一张图，可以从Tina SDK 全局看打包的作用位置，以及数据的流动。

![image-20230104104033322](https://cdn.staticaly.com/gh/DongshanPI/Docs-Photos@master/Tina-Sdk/Linux_Packflow_DevGuide_image-20230104104033322.png)

## 4.4 固件组成成员分析

固件包本质是由一系列的文件组成，类似于一个压缩包，把多个文件压缩成了一个固件包。这里通过一个描述性的配置文件(image.cfg)，把需要添加到固件包的文件枚举出来。然后打包过程就读取这个配置文件，生成了最终的固件包。由do_finish 函数可以知道，生成固件的工具是dragon，dragon 工具需要2 个配置文件image.cfg 和sys_partition.fex，下面将会分析这2个配置文件。

### 4.4.1 image.cfg 配置文件分析

用文本方式，打开tina/out/xxxplatform/image/image.cfg 文件，可以看到大致如下的内容：

```
[FILELIST]
{filename = "sys_config.fex", maintype = ITEM_COMMON, subtype = "
SYS_CONFIG100000",},
{filename = "config.fex", maintype = ITEM_COMMON, subtype = "
SYS_CONFIG_BIN00",},
{filename = "board.fex", maintype = ITEM_COMMON, subtype = "
BOARD_CONFIG_BIN",},
{filename = "split_xxxx.fex", maintype = ITEM_COMMON, subtype = "
SPLIT_0000000000",},
{filename = "sys_partition.fex", maintype = ITEM_COMMON, subtype = "
SYS_CONFIG000000",},
{filename = "sunxi.fex", maintype = ITEM_COMMON, subtype = "
DTB_CONFIG000000",},
{filename = "boot0_nand.fex", maintype = ITEM_BOOT, subtype = "
BOOT0_0000000000",},
{filename = "boot0_sdcard.fex", maintype = "12345678", subtype = "1234567890
BOOT_0",},
{filename = "u-boot.fex", maintype = "12345678", subtype = "
UBOOT_0000000000",},
{filename = "toc1.fex", maintype = "12345678", subtype = "
TOC1_00000000000",},
{filename = "toc0.fex", maintype = "12345678", subtype = "
TOC0_00000000000",},
{filename = "fes1.fex", maintype = ITEM_FES, subtype = "FES_1
-0000000000",},
{filename = "boot_package.fex", maintype = "12345678", subtype = "BOOTPKG
-00000000",},
;-------------------------------usb量产部分-------------------------------------;
;-->tools文件
{filename = "usbtool.fex", maintype = "PXTOOLSB", subtype = "
xxxxxxxxxxxxxxxx",},
{filename = "aultools.fex", maintype = "UPFLYTLS", subtype = "
xxxxxxxxxxxxxxxx",},
{filename = "aultls32.fex", maintype = "UPFLTL32", subtype = "
xxxxxxxxxxxxxxxx",},
;-------------------------------卡量产部分----------------------------------------;
;-->固定不变的PC使用
{filename = "cardtool.fex", maintype = "12345678", subtype = "1234567890
cardtl",},
{filename = "cardscript.fex", maintype = "12345678", subtype = "1234567890
script",},
;-->需要烧写到卡上的文件
{filename = "sunxi_mbr.fex", maintype = "12345678", subtype = "1234567890
___MBR",},
{filename = "dlinfo.fex", maintype = "12345678", subtype = "1234567890
DLINFO",},
{filename = "arisc.fex", maintype = "12345678", subtype = "1234567890
ARISC" ,},
;镜像配置信息
[IMAGE_CFG]
version = 0x100234 ;-->Image的版本
pid = 0x00001234 ;-->产品ID
vid = 0x00008743 ;-->供应商ID
hardwareid = 0x100 ;-->硬件ID bootrom
firmwareid = 0x100 ;-->固件ID bootrom
bootromconfig = "bootrom_071203_00001234.cfg"
rootfsconfig = "rootfs.cfg"
filelist = FILELIST
imagename = tina_XXXXXX.img
```

该文件项的格式：

```
filename= name,maintype=ITEM_ROOTFSFAT16,subtype = user_define
```

当用户需要添加文件的时候，按照同样的格式，把自己需要的文件写到脚本文件中即可。

• filename：打包文件
是指文件的全路径。可以使用相对路径，如上述文件中，就使用了相对路径。
• maintype：打包格式
表明文件的格式类型，该文件有此类型定义的列表。
• subtype：自定义名称
用户自己定义的名称，使用数字和英文字符(区分大小写)，最大长度必须为16 字节。只要按照上述规则书写，并放到文件的[FILELIST] 之后，等到打包的时候就会自动把文件添加到固件包中。
下表描述image.cfg 文件中的各固件成员的作用。

![image-20230104104210037](https://cdn.staticaly.com/gh/DongshanPI/Docs-Photos@master/Tina-Sdk/Linux_Packflow_DevGuide_image-20230104104210037.png)

### 4.4.2 sys_partition.fex 配置文件分析

除image.cfg 文件所列的文件，固件还包含了sys_partition.fex 所列的分区的文件。用文本文件打开sys_partition.fex，可以看到大致如下的内容（主要分区有3 个，不同方案分区表可能不一样，用户也可以添加自己的分区）：

```
[partition_start]
[partition]
name = env
size = 32768
downloadfile = "env.fex"
user_type = 0x8000
[partition]
name = boot
size = 131072
downloadfile = "boot.fex"
user_type = 0x8000
[partition]
name = rootfs
size = 1048576
downloadfile = "rootfs.fex"
user_type = 0x8000
```

这是一个规划磁盘分区的文件，一个分区的属性，有如下几项：
• 分区名称
• 分区的大小
• 下载的文件
• 分区的用户属性

以下是文件中所描述的一个分区的属性：
• name：分区名称
分区名称由用户自定义。当用户在定义一个分区的时候，可以把这里改成自己希望的字符串，但是长度不能超过16 个字节。
• size: 分区的大小
定义该分区的大小，以扇区的单位。
• downloadfile: 下载的文件
下载文件的路径和名称，可以使用相对路径，相对是指相对于image.cfg 文件所在分区，也可以
使用绝对路径。
• user_type: 分区的用户属性

目前该标志位只有spi nand 的ubi 文件系统还在使用，是历史遗留问题，客户可以不理会，仿照文档中的分区填写即可（例如0x8000）。
下表描述了sys_partition.fex 文件指定的分区里的文件。

| 固件成员   | 成员作用                                         |
| ---------- | ------------------------------------------------ |
| env.fex    | u-boot 的基本配置文件                            |
| boot.fex   | tina SDK 生成的boot.img 的软链接，主要包含kernel |
| rootfs.fex | tina SDK 生成的rootfs 镜像的软链接，根文件系统   |
