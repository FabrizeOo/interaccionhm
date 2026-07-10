"""
generate_cedula_ar.py
Generates cedula.glb with the real ballot_page_1.png texture embedded.
Uses pygltflib to build a proper textured quad mesh (.glb) that shows the
ballot image in the AR model-viewer.
"""
import base64
import json
import struct
import os
from PIL import Image
import io

# ---------------------------------------------------------------
# Paths
# ---------------------------------------------------------------
TEXTURE_PATH = "public/textures/ballot_page_1.png"
OUTPUT_PATH  = "public/models/cedula.glb"

# ---------------------------------------------------------------
# A4 proportions in metres (same as the in-scene PlaneGeometry)
# ---------------------------------------------------------------
W = 0.21   # width  (X)
H = 0.297  # height (Y / up axis in GLB)
D = 0.001  # thickness

# ---------------------------------------------------------------
# Build a minimal GLB by hand (no external deps beyond pygltflib)
# ---------------------------------------------------------------
from pygltflib import (
    GLTF2, Scene, Node, Mesh, Primitive, Accessor, BufferView, Buffer,
    Material, Texture, TextureInfo, Image as GltfImage, Sampler,
    Asset, FLOAT, UNSIGNED_INT, UNSIGNED_SHORT
)
from pygltflib import ELEMENT_ARRAY_BUFFER, ARRAY_BUFFER

# ---- Read and resize texture for AR (keep quality but cap at 1024px wide) ----
img = Image.open(TEXTURE_PATH).convert("RGB")
max_side = 1024
if img.width > max_side or img.height > max_side:
    img.thumbnail((max_side, max_side * img.height // img.width), Image.LANCZOS)
buf_png = io.BytesIO()
img.save(buf_png, format="PNG", optimize=True)
texture_bytes = buf_png.getvalue()
print(f"Texture size for AR GLB: {img.size}, {len(texture_bytes)//1024} KB")

# ---- Geometry: a flat quad (two triangles) facing +Y (like lying flat) ----
# Positions (x, y, z)  — flat on the XZ plane, centred at origin
half_w = W / 2
half_h = H / 2

positions = [
    (-half_w,  0.0, -half_h),  # 0: back-left
    ( half_w,  0.0, -half_h),  # 1: back-right
    ( half_w,  0.0,  half_h),  # 2: front-right
    (-half_w,  0.0,  half_h),  # 3: front-left
]

# UV (u, v) — standard mapping
uvs = [
    (0.0, 0.0),  # 0
    (1.0, 0.0),  # 1
    (1.0, 1.0),  # 2
    (0.0, 1.0),  # 3
]

# Normals pointing up
normals = [(0.0, 1.0, 0.0)] * 4

# Indices (two CCW triangles)
indices = [0, 2, 1,   0, 3, 2]

# ---- Pack binary data ----
def pack_floats(data_list):
    flat = [v for tup in data_list for v in tup]
    return struct.pack(f"<{len(flat)}f", *flat)

def pack_ushorts(data_list):
    return struct.pack(f"<{len(data_list)}H", *data_list)

pos_bytes    = pack_floats(positions)
uv_bytes     = pack_floats(uvs)
normal_bytes = pack_floats(normals)
idx_bytes    = pack_ushorts(indices)

# Pad each section to 4-byte alignment
def pad4(b):
    r = len(b) % 4
    return b + b'\x00' * (4 - r if r else 0)

idx_bytes    = pad4(idx_bytes)
pos_bytes    = pad4(pos_bytes)
uv_bytes     = pad4(uv_bytes)
normal_bytes = pad4(normal_bytes)
tex_bytes    = pad4(texture_bytes)

# Offsets
off_idx    = 0
off_pos    = off_idx    + len(idx_bytes)
off_uv     = off_pos    + len(pos_bytes)
off_normal = off_uv     + len(uv_bytes)
off_tex    = off_normal + len(normal_bytes)
total_len  = off_tex    + len(tex_bytes)

bin_data = idx_bytes + pos_bytes + uv_bytes + normal_bytes + tex_bytes

# ---- Build GLTF structure ----
gltf = GLTF2()
gltf.asset = Asset(version="2.0", generator="generate_cedula_ar.py")

# Buffer
gltf.buffers.append(Buffer(byteLength=total_len))

# BufferViews
gltf.bufferViews.append(BufferView(buffer=0, byteOffset=off_idx,    byteLength=len(idx_bytes),    target=ELEMENT_ARRAY_BUFFER))  # 0: indices
gltf.bufferViews.append(BufferView(buffer=0, byteOffset=off_pos,    byteLength=len(pos_bytes),    target=ARRAY_BUFFER))           # 1: positions
gltf.bufferViews.append(BufferView(buffer=0, byteOffset=off_uv,     byteLength=len(uv_bytes),     target=ARRAY_BUFFER))           # 2: uvs
gltf.bufferViews.append(BufferView(buffer=0, byteOffset=off_normal, byteLength=len(normal_bytes), target=ARRAY_BUFFER))           # 3: normals
gltf.bufferViews.append(BufferView(buffer=0, byteOffset=off_tex,    byteLength=len(tex_bytes)))                                   # 4: texture image

# Accessors
gltf.accessors.append(Accessor(bufferView=0, componentType=UNSIGNED_SHORT, count=len(indices),     type="SCALAR",  byteOffset=0))                         # 0: indices
gltf.accessors.append(Accessor(bufferView=1, componentType=FLOAT,          count=len(positions),   type="VEC3",    byteOffset=0,                           # 1: pos
                                min=[-half_w, 0.0, -half_h], max=[half_w, 0.0, half_h]))
gltf.accessors.append(Accessor(bufferView=2, componentType=FLOAT,          count=len(uvs),         type="VEC2",    byteOffset=0))                          # 2: uvs
gltf.accessors.append(Accessor(bufferView=3, componentType=FLOAT,          count=len(normals),     type="VEC3",    byteOffset=0))                          # 3: normals

# Texture / material
gltf.samplers.append(Sampler(magFilter=9729, minFilter=9987, wrapS=33071, wrapT=33071))  # LINEAR, CLAMP_TO_EDGE
gltf.images.append(GltfImage(bufferView=4, mimeType="image/png"))
gltf.textures.append(Texture(sampler=0, source=0))
gltf.materials.append(Material(
    name="cedula_mat",
    pbrMetallicRoughness={
        "baseColorTexture": {"index": 0},
        "metallicFactor": 0.0,
        "roughnessFactor": 0.9
    },
    doubleSided=True
))

# Mesh
primitive = Primitive(
    attributes={"POSITION": 1, "TEXCOORD_0": 2, "NORMAL": 3},
    indices=0,
    material=0
)
gltf.meshes.append(Mesh(primitives=[primitive]))

# Node + Scene
gltf.nodes.append(Node(mesh=0))
gltf.scenes.append(Scene(nodes=[0]))
gltf.scene = 0

# ---- Export as GLB ----
gltf.set_binary_blob(bin_data)
gltf.save_binary(OUTPUT_PATH)

file_size = os.path.getsize(OUTPUT_PATH)
print(f"[SUCCESS] cedula.glb generated -> {OUTPUT_PATH} ({file_size//1024} KB)")
print("    The ballot texture is embedded. model-viewer will display the real ballot in AR.")
