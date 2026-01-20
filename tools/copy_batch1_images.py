import os
import shutil
import re

src_dir = r'C:\Users\Sam Deiter\.gemini\antigravity\brain\f7826610-6e62-4dba-b4e0-988f29bd70a9'
base_dst = r'c:\Users\Sam Deiter\Documents\GitHub\UE5ScenarioTracker\assets\generated'

# Mapping of prefix patterns to scenario folders and step names
mappings = {
    # VSM
    'vsm_step12': ('VirtualShadowMapArtifacts', 'step-12.png'),
    
    # ReplicationVariableNotSyncing (16 steps)
    'replication_step1': ('ReplicationVariableNotSyncing', 'step-1.png'),
    'replication_step2': ('ReplicationVariableNotSyncing', 'step-2.png'),
    'replication_step3': ('ReplicationVariableNotSyncing', 'step-3.png'),
    'replication_step4': ('ReplicationVariableNotSyncing', 'step-4.png'),
    'replication_step5': ('ReplicationVariableNotSyncing', 'step-5.png'),
    'replication_step6': ('ReplicationVariableNotSyncing', 'step-6.png'),
    'replication_step7': ('ReplicationVariableNotSyncing', 'step-7.png'),
    'replication_step8': ('ReplicationVariableNotSyncing', 'step-8.png'),
    'replication_step9': ('ReplicationVariableNotSyncing', 'step-9.png'),
    'replication_step10': ('ReplicationVariableNotSyncing', 'step-10.png'),
    'replication_step11': ('ReplicationVariableNotSyncing', 'step-11.png'),
    'replication_step12': ('ReplicationVariableNotSyncing', 'step-12.png'),
    'replication_conclusion': ('ReplicationVariableNotSyncing', 'conclusion.png'),
    
    # NiagaraDataInterfaceBindingError (16 steps)
    'niagara_di_step1': ('NiagaraDataInterfaceBindingError', 'step-1.png'),
    'niagara_di_step2': ('NiagaraDataInterfaceBindingError', 'step-2.png'),
    'niagara_di_step3': ('NiagaraDataInterfaceBindingError', 'step-3.png'),
    'niagara_di_step4': ('NiagaraDataInterfaceBindingError', 'step-4.png'),
    'niagara_di_step5': ('NiagaraDataInterfaceBindingError', 'step-5.png'),
    'niagara_di_step6': ('NiagaraDataInterfaceBindingError', 'step-6.png'),
    'niagara_di_step7': ('NiagaraDataInterfaceBindingError', 'step-7.png'),
    'niagara_di_step8': ('NiagaraDataInterfaceBindingError', 'step-8.png'),
    'niagara_di_step9': ('NiagaraDataInterfaceBindingError', 'step-9.png'),
    'niagara_di_step10': ('NiagaraDataInterfaceBindingError', 'step-10.png'),
    'niagara_di_step11': ('NiagaraDataInterfaceBindingError', 'step-11.png'),
    'niagara_di_step12': ('NiagaraDataInterfaceBindingError', 'step-12.png'),
    'niagara_di_step13': ('NiagaraDataInterfaceBindingError', 'step-13.png'),
    'niagara_di_step14': ('NiagaraDataInterfaceBindingError', 'step-14.png'),
    'niagara_di_conclusion': ('NiagaraDataInterfaceBindingError', 'conclusion.png'),
    
    # InputActionNotResponding (11 steps)
    'input_step1': ('InputActionNotResponding', 'step-1.png'),
    'input_step2': ('InputActionNotResponding', 'step-2.png'),
    'input_step3': ('InputActionNotResponding', 'step-3.png'),
    'input_step4': ('InputActionNotResponding', 'step-4.png'),
    'input_step5': ('InputActionNotResponding', 'step-5.png'),
    'input_step6': ('InputActionNotResponding', 'step-6.png'),
    'input_step7': ('InputActionNotResponding', 'step-7.png'),
    'input_step8': ('InputActionNotResponding', 'step-8.png'),
    'input_step9': ('InputActionNotResponding', 'step-9.png'),
    'input_step10': ('InputActionNotResponding', 'step-10.png'),
    'input_conclusion': ('InputActionNotResponding', 'conclusion.png'),
    
    # LumenReflectionIncorrectColor (13 steps)
    'lumen_step1': ('LumenReflectionIncorrectColor', 'step-1.png'),
    'lumen_step2': ('LumenReflectionIncorrectColor', 'step-2.png'),
    'lumen_step3': ('LumenReflectionIncorrectColor', 'step-3.png'),
    'lumen_step4': ('LumenReflectionIncorrectColor', 'step-4.png'),
    'lumen_step5': ('LumenReflectionIncorrectColor', 'step-5.png'),
    'lumen_step6': ('LumenReflectionIncorrectColor', 'step-6.png'),
    'lumen_step7': ('LumenReflectionIncorrectColor', 'step-7.png'),
    'lumen_step8': ('LumenReflectionIncorrectColor', 'step-8.png'),
    'lumen_step9': ('LumenReflectionIncorrectColor', 'step-9.png'),
    'lumen_step10': ('LumenReflectionIncorrectColor', 'step-10.png'),
    'lumen_step11': ('LumenReflectionIncorrectColor', 'step-11.png'),
    'lumen_step12': ('LumenReflectionIncorrectColor', 'step-12.png'),
    'lumen_conclusion': ('LumenReflectionIncorrectColor', 'conclusion.png'),
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
