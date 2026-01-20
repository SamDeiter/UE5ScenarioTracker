import shutil
import os

src = 'C:/Users/Sam Deiter/.gemini/antigravity/brain/f7826610-6e62-4dba-b4e0-988f29bd70a9'
base = 'c:/Users/Sam Deiter/Documents/GitHub/UE5ScenarioTracker/assets/generated'

# BlendSpaceFootSliding
dst = os.path.join(base, 'BlendSpaceFootSliding')
os.makedirs(dst, exist_ok=True)
blend_files = [
    ('blend_step1_1768313088616.png', 'step-1.png'),
    ('blend_step2_1768313107016.png', 'step-2.png'),
    ('blend_step3_1768313124164.png', 'step-3.png'),
    ('blend_step4_1768313138250.png', 'step-4.png'),
    ('blend_step5_1768313155142.png', 'step-5.png'),
    ('blend_step6_1768313171254.png', 'step-6.png'),
    ('blend_step7_1768313186944.png', 'step-7.png'),
    ('blend_step8_1768313204888.png', 'step-8.png'),
    ('blend_step9_1768313220755.png', 'step-9.png'),
    ('blend_step10_1768313242885.png', 'step-10.png'),
    ('blend_step11_1768313257724.png', 'step-11.png'),
    ('blend_step12_1768313272467.png', 'step-12.png'),
    ('blend_conclusion_1768313289184.png', 'conclusion.png'),
]
for s, d in blend_files:
    shutil.copy(os.path.join(src, s), os.path.join(dst, d))
print(f'Copied {len(blend_files)} BlendSpaceFootSliding images')

# ControlRigFootIKGroundPenetration
dst = os.path.join(base, 'ControlRigFootIKGroundPenetration')
os.makedirs(dst, exist_ok=True)
ik_files = [
    ('ik_step1_1768313324019.png', 'step-1.png'),
    ('ik_step2_1768313342111.png', 'step-2.png'),
    ('ik_step3_1768313357777.png', 'step-3.png'),
    ('ik_step4_1768313376867.png', 'step-4.png'),
    ('ik_step5_1768313396747.png', 'step-5.png'),
    ('ik_step6_1768313412280.png', 'step-6.png'),
    ('ik_step7_1768313432093.png', 'step-7.png'),
    ('ik_step8_1768313447728.png', 'step-8.png'),
    ('ik_step9_1768313468218.png', 'step-9.png'),
    ('ik_step10_1768313487540.png', 'step-10.png'),
    ('ik_conclusion_1768313507505.png', 'conclusion.png'),
]
for s, d in ik_files:
    shutil.copy(os.path.join(src, s), os.path.join(dst, d))
print(f'Copied {len(ik_files)} ControlRigFootIKGroundPenetration images')

# LiveLinkBodyTrackingJitter
dst = os.path.join(base, 'LiveLinkBodyTrackingJitter')
os.makedirs(dst, exist_ok=True)
livelink_files = [
    ('livelink_step1_1768313543980.png', 'step-1.png'),
    ('livelink_step2_1768313560832.png', 'step-2.png'),
    ('livelink_step3_1768313585752.png', 'step-3.png'),
    ('livelink_step5_1768313605239.png', 'step-5.png'),
    ('livelink_step6_1768313629504.png', 'step-6.png'),
    ('livelink_step7_1768313658613.png', 'step-7.png'),
    ('livelink_step8_1768313679926.png', 'step-8.png'),
    ('livelink_step9_1768313698664.png', 'step-9.png'),
    ('livelink_step14_1768313718411.png', 'step-14.png'),
    ('livelink_step15_1768313745254.png', 'step-15.png'),
    ('livelink_conclusion_1768313764056.png', 'conclusion.png'),
]
for s, d in livelink_files:
    shutil.copy(os.path.join(src, s), os.path.join(dst, d))
print(f'Copied {len(livelink_files)} LiveLinkBodyTrackingJitter images')

# PhysicsAssetRagdollExplosion
dst = os.path.join(base, 'PhysicsAssetRagdollExplosion')
os.makedirs(dst, exist_ok=True)
ragdoll_files = [
    ('ragdoll_step1_1768313824303.png', 'step-1.png'),
    ('ragdoll_step2_1768313856919.png', 'step-2.png'),
    ('ragdoll_step3_1768313874405.png', 'step-3.png'),
    ('ragdoll_step5_1768313894039.png', 'step-5.png'),
    ('ragdoll_step7_1768313910734.png', 'step-7.png'),
    ('ragdoll_step8_1768313929911.png', 'step-8.png'),
    ('ragdoll_step9_1768313956451.png', 'step-9.png'),
    ('ragdoll_step10_1768313973073.png', 'step-10.png'),
    ('ragdoll_step11_1768313988109.png', 'step-11.png'),
    ('ragdoll_step12_1768314006614.png', 'step-12.png'),
    ('ragdoll_conclusion_1768314024752.png', 'conclusion.png'),
]
for s, d in ragdoll_files:
    shutil.copy(os.path.join(src, s), os.path.join(dst, d))
print(f'Copied {len(ragdoll_files)} PhysicsAssetRagdollExplosion images')

print('Done!')
