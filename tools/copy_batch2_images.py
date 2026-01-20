import os
import shutil

src_dir = r'C:\Users\Sam Deiter\.gemini\antigravity\brain\f7826610-6e62-4dba-b4e0-988f29bd70a9'
base_dst = r'c:\Users\Sam Deiter\Documents\GitHub\UE5ScenarioTracker\assets\generated'

# Batch 2 mappings - MaterialNotWorkingInPIE, SequencerCameraCutNotPlaying, WorldPartitionCellBoundaryPopIn
mappings = {
    # MaterialNotWorkingInPIE
    'material_pie_step1': ('MaterialNotWorkingInPIE', 'step-1.png'),
    'material_pie_step2': ('MaterialNotWorkingInPIE', 'step-2.png'),
    'material_pie_step3': ('MaterialNotWorkingInPIE', 'step-3.png'),
    'material_pie_step4': ('MaterialNotWorkingInPIE', 'step-4.png'),
    'material_pie_step5': ('MaterialNotWorkingInPIE', 'step-5.png'),
    'material_pie_step6': ('MaterialNotWorkingInPIE', 'step-6.png'),
    'material_pie_step7': ('MaterialNotWorkingInPIE', 'step-7.png'),
    'material_pie_step8': ('MaterialNotWorkingInPIE', 'step-8.png'),
    'material_pie_step9': ('MaterialNotWorkingInPIE', 'step-9.png'),
    'material_pie_step10': ('MaterialNotWorkingInPIE', 'step-10.png'),
    'material_pie_conclusion': ('MaterialNotWorkingInPIE', 'conclusion.png'),
    
    # SequencerCameraCutNotPlaying
    'cam_cut_step1': ('SequencerCameraCutNotPlaying', 'step-1.png'),
    'cam_cut_step2': ('SequencerCameraCutNotPlaying', 'step-2.png'),
    'cam_cut_step3': ('SequencerCameraCutNotPlaying', 'step-3.png'),
    'cam_cut_step4': ('SequencerCameraCutNotPlaying', 'step-4.png'),
    'cam_cut_step5': ('SequencerCameraCutNotPlaying', 'step-5.png'),
    'cam_cut_step6': ('SequencerCameraCutNotPlaying', 'step-6.png'),
    'cam_cut_step7': ('SequencerCameraCutNotPlaying', 'step-7.png'),
    'cam_cut_step8': ('SequencerCameraCutNotPlaying', 'step-8.png'),
    'cam_cut_step9': ('SequencerCameraCutNotPlaying', 'step-9.png'),
    'cam_cut_step10': ('SequencerCameraCutNotPlaying', 'step-10.png'),
    'cam_cut_step11': ('SequencerCameraCutNotPlaying', 'step-11.png'),
    'cam_cut_step12': ('SequencerCameraCutNotPlaying', 'step-12.png'),
    'cam_cut_conclusion': ('SequencerCameraCutNotPlaying', 'conclusion.png'),
    
    # WorldPartitionCellBoundaryPopIn
    'wp_step1': ('WorldPartitionCellBoundaryPopIn', 'step-1.png'),
    'wp_step2': ('WorldPartitionCellBoundaryPopIn', 'step-2.png'),
    'wp_step3': ('WorldPartitionCellBoundaryPopIn', 'step-3.png'),
    'wp_step4': ('WorldPartitionCellBoundaryPopIn', 'step-4.png'),
    'wp_step5': ('WorldPartitionCellBoundaryPopIn', 'step-5.png'),
    'wp_step6': ('WorldPartitionCellBoundaryPopIn', 'step-6.png'),
    'wp_step7': ('WorldPartitionCellBoundaryPopIn', 'step-7.png'),
    'wp_step8': ('WorldPartitionCellBoundaryPopIn', 'step-8.png'),
    'wp_step9': ('WorldPartitionCellBoundaryPopIn', 'step-9.png'),
    'wp_step10': ('WorldPartitionCellBoundaryPopIn', 'step-10.png'),
    'wp_step11': ('WorldPartitionCellBoundaryPopIn', 'step-11.png'),
    'wp_step12': ('WorldPartitionCellBoundaryPopIn', 'step-12.png'),
    'wp_conclusion': ('WorldPartitionCellBoundaryPopIn', 'conclusion.png'),
}

copied = 0
for filename in os.listdir(src_dir):
    if not filename.endswith('.png'):
        continue
    for prefix, (scenario, dst_name) in mappings.items():
        if filename.startswith(prefix + '_'):
            dst_folder = os.path.join(base_dst, scenario)
            os.makedirs(dst_folder, exist_ok=True)
            src_path = os.path.join(src_dir, filename)
            dst_path = os.path.join(dst_folder, dst_name)
            shutil.copy(src_path, dst_path)
            print(f'Copied {filename} -> {scenario}/{dst_name}')
            copied += 1
            break

print(f'\nTotal copied: {copied} images')
