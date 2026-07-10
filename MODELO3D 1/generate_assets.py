import os
import wave
import struct
import math
import numpy as np
import trimesh

# Create output directories if they don't exist
os.makedirs("public/models", exist_ok=True)
os.makedirs("public/audio", exist_ok=True)

# ----------------------------------------------------
# 1. AUDIO GENERATION (.wav)
# ----------------------------------------------------

def generate_wav(filename, duration, sample_rate=44100, sound_type="sine", freq=440.0, freq2=880.0):
    filepath = os.path.join("public/audio", filename)
    num_samples = int(duration * sample_rate)
    
    # Open wave file
    with wave.open(filepath, "w") as wav_file:
        wav_file.setnchannels(1)  # Mono
        wav_file.setsampwidth(2)  # 16-bit
        wav_file.setframerate(sample_rate)
        
        data = bytearray()
        for i in range(num_samples):
            t = i / sample_rate
            
            if sound_type == "sine":
                val = math.sin(2 * math.pi * freq * t)
            elif sound_type == "chime":
                # Dual tone chime with decay
                decay = math.exp(-6 * t)
                val1 = math.sin(2 * math.pi * freq * t)
                val2 = math.sin(2 * math.pi * freq2 * t)
                val = 0.6 * val1 * decay + 0.4 * val2 * decay
            elif sound_type == "click":
                # Very short sharp click
                decay = math.exp(-80 * t)
                val = math.sin(2 * math.pi * freq * t) * decay
            elif sound_type == "rustle":
                # Noise representing paper rustling
                import random
                decay = math.exp(-8 * t)
                val = random.uniform(-1.0, 1.0) * decay
            elif sound_type == "step":
                # Low thud with decay
                decay = math.exp(-25 * t)
                val = math.sin(2 * math.pi * 80 * t) * decay
            else:
                val = 0.0
                
            # Clamp and convert to 16-bit signed integer
            val = max(-1.0, min(1.0, val))
            sample = int(val * 32767)
            data += struct.pack("<h", sample)
            
        wav_file.writeframes(data)
    print(f"Generated audio: {filepath}")

# Generate all required audio files
generate_wav("pasos.wav", duration=0.25, sound_type="step")
generate_wav("click.wav", duration=0.08, sound_type="click", freq=1200)
generate_wav("entrega.wav", duration=0.5, sound_type="rustle")
generate_wav("insercion.wav", duration=0.6, sound_type="rustle")
generate_wav("confirmacion.wav", duration=1.0, sound_type="chime", freq=523.25, freq2=659.25) # C5 and E5 chord

# ----------------------------------------------------
# 2. 3D MODELS GENERATION (.glb)
# ----------------------------------------------------

def save_glb(scene, filename):
    filepath = os.path.join("public/models", filename)
    scene.export(filepath)
    print(f"Generated 3D Model: {filepath}")

# Color helper
def create_colored_mesh(mesh_type, extents=None, radius=None, height=None, color=[128, 128, 128, 255], **kwargs):
    if mesh_type == "box":
        mesh = trimesh.creation.box(extents=extents, **kwargs)
    elif mesh_type == "cylinder":
        mesh = trimesh.creation.cylinder(radius=radius, height=height, sections=16, **kwargs)
    elif mesh_type == "sphere":
        mesh = trimesh.creation.icosphere(radius=radius, subdivisions=2, **kwargs)
    else:
        raise ValueError("Unknown mesh type")
        
    mesh.visual.face_colors = np.array([color] * len(mesh.faces), dtype=np.uint8)
    return mesh

# A. Mesa (Table)
mesa_scene = trimesh.Scene()
# Table Top (Wood brown)
top = create_colored_mesh("box", extents=[1.6, 0.06, 0.8], color=[160, 110, 70, 255])
top.apply_translation([0, 0.73, 0])
mesa_scene.add_geometry(top, node_name="table_top")
# 4 Legs (Dark metal grey)
leg_coords = [(-0.7, -0.3), (0.7, -0.3), (-0.7, 0.3), (0.7, 0.3)]
for idx, (x, z) in enumerate(leg_coords):
    leg = create_colored_mesh("cylinder", radius=0.03, height=0.7, color=[50, 50, 50, 255])
    leg.apply_translation([x, 0.35, z])
    mesa_scene.add_geometry(leg, node_name=f"leg_{idx}")
save_glb(mesa_scene, "mesa.glb")

# B. Silla (Chair)
silla_scene = trimesh.Scene()
# Seat (Dark blue fabric)
seat = create_colored_mesh("box", extents=[0.45, 0.04, 0.45], color=[30, 80, 150, 255])
seat.apply_translation([0, 0.43, 0])
silla_scene.add_geometry(seat, node_name="seat")
# Backrest
back = create_colored_mesh("box", extents=[0.45, 0.35, 0.04], color=[30, 80, 150, 255])
back.apply_translation([0, 0.78, -0.2])
silla_scene.add_geometry(back, node_name="backrest")
# Legs
chair_legs = [(-0.19, -0.19), (0.19, -0.19), (-0.19, 0.19), (0.19, 0.19)]
for idx, (x, z) in enumerate(chair_legs):
    leg = create_colored_mesh("cylinder", radius=0.018, height=0.41, color=[30, 30, 30, 255])
    leg.apply_translation([x, 0.205, z])
    silla_scene.add_geometry(leg, node_name=f"leg_{idx}")
save_glb(silla_scene, "silla.glb")

# C. Anfora (Ballot Box / Urn)
anfora_scene = trimesh.Scene()
# Urn Body (Institutional light grey)
body = create_colored_mesh("box", extents=[0.38, 0.46, 0.38], color=[230, 230, 235, 255])
body.apply_translation([0, 0.23, 0])
anfora_scene.add_geometry(body, node_name="urn_body")
# Urn Lid (Bright electoral yellow)
lid = create_colored_mesh("box", extents=[0.4, 0.04, 0.4], color=[255, 200, 0, 255])
lid.apply_translation([0, 0.48, 0])
anfora_scene.add_geometry(lid, node_name="urn_lid")
# Slot (Black slit)
slot = create_colored_mesh("box", extents=[0.18, 0.002, 0.02], color=[10, 10, 10, 255])
slot.apply_translation([0, 0.501, 0])
anfora_scene.add_geometry(slot, node_name="urn_slot")
save_glb(anfora_scene, "anfora.glb")

# D. Cabina (Voting Booth)
cabina_scene = trimesh.Scene()
# Cardboard Back Panel
back_panel = create_colored_mesh("box", extents=[0.8, 0.9, 0.02], color=[200, 160, 115, 255])
back_panel.apply_translation([0, 1.25, -0.3])
cabina_scene.add_geometry(back_panel, node_name="back_panel")
# Cardboard Left Panel
left_panel = create_colored_mesh("box", extents=[0.02, 0.9, 0.6], color=[200, 160, 115, 255])
left_panel.apply_translation([-0.4, 1.25, 0.0])
cabina_scene.add_geometry(left_panel, node_name="left_panel")
# Cardboard Right Panel
right_panel = create_colored_mesh("box", extents=[0.02, 0.9, 0.6], color=[200, 160, 115, 255])
right_panel.apply_translation([0.4, 1.25, 0.0])
cabina_scene.add_geometry(right_panel, node_name="right_panel")
# Booth Desk/Shelf
shelf = create_colored_mesh("box", extents=[0.78, 0.02, 0.58], color=[180, 140, 100, 255])
shelf.apply_translation([0, 0.8, 0.0])
cabina_scene.add_geometry(shelf, node_name="shelf")
save_glb(cabina_scene, "cabina.glb")

# E. DNI (ID Card)
dni_scene = trimesh.Scene()
# Cyan plastic DNI
dni_card = create_colored_mesh("box", extents=[0.085, 0.002, 0.054], color=[90, 170, 220, 255])
dni_card.apply_translation([0, 0.001, 0])
dni_scene.add_geometry(dni_card, node_name="dni_card")
# Photo patch (dark blue/grey)
photo = create_colored_mesh("box", extents=[0.02, 0.0022, 0.025], color=[40, 50, 80, 255])
photo.apply_translation([-0.025, 0.001, -0.005])
dni_scene.add_geometry(photo, node_name="dni_photo")
save_glb(dni_scene, "dni.glb")

# F. Lapicero (Pen)
lapicero_scene = trimesh.Scene()
# Pen Body (Blue barrel)
pen_body = create_colored_mesh("cylinder", radius=0.004, height=0.13, color=[20, 50, 150, 255])
pen_body.apply_translation([0, 0.065, 0])
lapicero_scene.add_geometry(pen_body, node_name="pen_body")
# Pen Tip (Silver metal tip)
pen_tip = create_colored_mesh("cylinder", radius=0.004, height=0.015, color=[180, 180, 180, 255])
pen_tip.apply_translation([0, 0.1375, 0])
lapicero_scene.add_geometry(pen_tip, node_name="pen_tip")
save_glb(lapicero_scene, "lapicero.glb")

# G. Cedula (Ballot Box Sheet)
# This is a flat 3D plan where the ballot_page_1 texture will be mapped.
# We make it have size 0.21 x 0.001 x 0.297 (matching A4 proportions).
cedula_scene = trimesh.Scene()
ballot = create_colored_mesh("box", extents=[0.21, 0.001, 0.297], color=[255, 255, 255, 255])
cedula_scene.add_geometry(ballot, node_name="ballot_sheet")
save_glb(cedula_scene, "cedula.glb")

# H. Character Model Helper
def build_humanoid(state="standing"):
    char_scene = trimesh.Scene()
    
    y_offset = 0.0 if state == "standing" else -0.3
    shirt_color = [0, 80, 160, 255] if state == "sitting" else [180, 40, 40, 255] # Sitting = Poll Member (Blue), Standing = Voter (Red)
    
    # 1. Torso
    torso = create_colored_mesh("box", extents=[0.35, 0.55, 0.22], color=shirt_color)
    torso.apply_translation([0, 1.0 + y_offset, 0])
    char_scene.add_geometry(torso, node_name="torso")
    
    # 2. Head
    head = create_colored_mesh("sphere", radius=0.12, color=[240, 195, 170, 255])
    head.apply_translation([0, 1.36 + y_offset, 0])
    char_scene.add_geometry(head, node_name="head")
    
    # Hair
    hair = create_colored_mesh("box", extents=[0.14, 0.06, 0.14], color=[40, 30, 25, 255])
    hair.apply_translation([0, 1.45 + y_offset, -0.02])
    char_scene.add_geometry(hair, node_name="hair")
    
    # 3. Left Arm
    l_arm = create_colored_mesh("cylinder", radius=0.045, height=0.45, color=shirt_color)
    l_arm.apply_translation([-0.22, 1.0 + y_offset, 0])
    char_scene.add_geometry(l_arm, node_name="left_arm")
    
    # 4. Right Arm
    r_arm = create_colored_mesh("cylinder", radius=0.045, height=0.45, color=shirt_color)
    r_arm.apply_translation([0.22, 1.0 + y_offset, 0])
    char_scene.add_geometry(r_arm, node_name="right_arm")
    
    # 5. Left Leg
    if state == "standing":
        l_leg = create_colored_mesh("cylinder", radius=0.055, height=0.7, color=[40, 40, 45, 255])
        l_leg.apply_translation([-0.1, 0.35, 0])
    else: # Sitting legs bent
        # Upper leg (Thigh)
        l_leg = create_colored_mesh("box", extents=[0.1, 0.1, 0.45], color=[40, 40, 45, 255])
        l_leg.apply_translation([-0.1, 0.725 + y_offset, 0.2])
    char_scene.add_geometry(l_leg, node_name="left_leg")
    
    # 6. Right Leg
    if state == "standing":
        r_leg = create_colored_mesh("cylinder", radius=0.055, height=0.7, color=[40, 40, 45, 255])
        r_leg.apply_translation([0.1, 0.35, 0])
    else: # Sitting legs bent
        # Upper leg (Thigh)
        r_leg = create_colored_mesh("box", extents=[0.1, 0.1, 0.45], color=[40, 40, 45, 255])
        r_leg.apply_translation([0.1, 0.725 + y_offset, 0.2])
    char_scene.add_geometry(r_leg, node_name="right_leg")
    
    # Additional legs parts for sitting (calf going down)
    if state == "sitting":
        l_calf = create_colored_mesh("cylinder", radius=0.045, height=0.4, color=[40, 40, 45, 255])
        l_calf.apply_translation([-0.1, 0.5 + y_offset, 0.4])
        char_scene.add_geometry(l_calf, node_name="left_calf")
        
        r_calf = create_colored_mesh("cylinder", radius=0.045, height=0.4, color=[40, 40, 45, 255])
        r_calf.apply_translation([0.1, 0.5 + y_offset, 0.4])
        char_scene.add_geometry(r_calf, node_name="right_calf")
        
    return char_scene

# Save character models
save_glb(build_humanoid("standing"), "persona.glb")
save_glb(build_humanoid("sitting"), "miembro_mesa.glb")

print("All assets generated successfully!")
