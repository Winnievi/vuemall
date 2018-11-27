<template>
<el-card class="box-card">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <el-row class="elrow">
        <el-col :span="15">
            <el-input v-model="searchVal" placeholder="请输入内容" class="input-with-select">
                <el-button @click="searchUser()" slot="append" icon="el-icon-search"></el-button>
            </el-input>
        </el-col>
        <el-col :span="5">
            <el-button @click="showDiaAddUser" type="success" plain>添加用户</el-button>
        </el-col>
    </el-row>
    <!-- 对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAddUser">
        <el-form :model="formData">
            <el-form-item label="用户名" :label-width="formLabelWidth">
                <el-input v-model="formData.username" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码" :label-width="formLabelWidth">
                <el-input v-model="formData.password" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" :label-width="formLabelWidth">
                <el-input v-model="formData.email" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="电话" :label-width="formLabelWidth">
                <el-input v-model="formData.mobile" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleAddUser = false">取 消</el-button>
            <el-button type="primary" @click="addUser()">确 定</el-button>
        </div>
    </el-dialog>

    <!-- 表格 -->
    <el-table v-loading="loading" :data="list" style="width: 100%">
        <el-table-column type="index" label="#" width="60">
        </el-table-column>
        <el-table-column prop="username" label="姓名" width="100">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180">
        </el-table-column>
        <el-table-column prop="mobile" label="电话" width="120">
        </el-table-column>

        <el-table-column label="创建日期" width="180">
            <template slot-scope="scope">
                {{scope.row.create_time | fmtdate}}
            </template>
        </el-table-column>

        <el-table-column label="用户状态" width="100">
            <template slot-scope="scope">
                <el-switch @change="changeMgState(scope.row)" v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
            </template>
        </el-table-column>

        <el-table-column prop="username" label="操作" min-width="160">
            <template slot-scope="scope">
                <el-row>
                    <el-button @click="showEditfirm(scope.row)" size="mini" plain type="primary" icon="el-icon-edit" circle></el-button>
                    <el-button @click="showRolefirm(scope.row)" size="mini" plain type="success" icon="el-icon-check" circle></el-button>
                    <el-button @click="showDelefirm(scope.row)" size="mini" plain type="danger" icon="el-icon-delete" circle></el-button>
                </el-row>
            </template>
        </el-table-column>
    </el-table>

    <!-- 对话框 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEditUser">
        <el-form :model="formData">
            <el-form-item label="用户名" :label-width="formLabelWidth">
                <el-input disabled v-model="formData.username" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" :label-width="formLabelWidth">
                <el-input v-model="formData.email" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="电话" :label-width="formLabelWidth">
                <el-input v-model="formData.mobile" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleEditUser = false">取 消</el-button>
            <el-button type="primary" @click="editUser()">确 定</el-button>
        </div>
    </el-dialog>

    <!-- 对话框 -->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleEditRole">
        <el-form>
            <el-form-item label="用户名" :label-width="formLabelWidth">
                {{currUsername}}
            </el-form-item>
            <el-form-item label="角色" :label-width="formLabelWidth">
                <el-select v-model="currRoleId">
                    <el-option disabled label="请选择" :value="-1"></el-option>
                    <el-option v-for="(item,index) in arrRoles" :key="index" :label="item.roleName" :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleEditRole = false">取 消</el-button>
            <el-button type="primary" @click="editRole()">确 定</el-button>
        </div>
    </el-dialog>

    <!-- 分页 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[2, 4, 6, 8]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>

</el-card>
</template>

<script>
export default {
    data() {
        return {
            list: [],
            //加载动画
            loading: false,
            //分页数据
            currentPage: 1,
            pagesize: 4,
            total: 1,
            //搜索
            searchVal: '',
            //对话框
            dialogFormVisibleAddUser: false,
            formLabelWidth: '120px',
            formData: {
                username: '',
                password: '',
                email: '',
                mobile: ''
            },
            dialogFormVisibleEditUser: false,
            currentId: -1,
            dialogFormVisibleEditRole: false,
            currUsername: '',
            currUserId:-1,
            currRoleId: -1,
            arrRoles: []
        }
    },
    methods: {
        //加载数据
        async loadTableDate() {
            this.loading = true

            const AUTH_TOKEN = sessionStorage.getItem('token')
            this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN;

            const res = await this.$http.get(
                `users?pagenum=${this.currentPage}&pagesize=${this.pagesize}&query=${this.searchVal}`
            )
            // console.log(res);

            const {
                data,
                meta
            } = res.data

            if (meta.status === 200) {
                this.total = res.data.data.total
                this.loading = false
                this.list = data.users
            }
        },
        //分页
        handleSizeChange(val) {
            // console.log(`每页 ${val} 条`);
            this.pagesize = val
            this.loadTableDate()
        },
        handleCurrentChange(val) {
            // console.log(`当前页: ${val}`);
            this.currentPage = val
            this.loadTableDate()
        },
        //搜索
        searchUser() {
            this.currentPage = 1
            this.loadTableDate()
        },
        //修改状态
        async changeMgState(user) {
            //修改请求
            const res = await this.$http.put(`users/${user.id}/state/${user.mg_state}`)
            const {
                meta: {
                    msg,
                    status
                }
            } = res.data

            if (status === 200) {
                this.$message.success(msg)
            }
        },
        //删除提示
        showDelefirm(user) {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const res = await this.$http.delete(`users/${user.id}`)

                // console.log(res)
                const {
                    meta: {
                        msg,
                        status
                    }
                } = res.data

                if (status === 200) {
                    this.currentPage = 1
                    this.loadTableDate()
                    this.$message.success(msg)
                }
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        showDiaAddUser() {
            this.dialogFormVisibleAddUser = true
        },
        //添加用户
        async addUser() {
            this.dialogFormVisibleAddUser = false
            const res = await this.$http.post('/users', this.formData)
            // console.log(res)
            const {
                meta: {
                    status,
                    msg
                }
            } = res.data
            if (status === 201) {
                //清空表单数据
                // for (const key in this.formData) {
                //     if (this.formData.hasOwnProperty(key)) {
                //         this.formData[key]='';
                //     }
                // }
                this.formData = {}

                this.loadTableDate()
                this.$message.success(msg)
            }
        },
        //编辑用户
        showEditfirm(user) {
            this.dialogFormVisibleEditUser = true
            this.formData = user
            this.currentId = user.id
        },
        async editUser() {
            this.dialogFormVisibleEditUser = false
            const res = await this.$http.put(`users/${this.currentId}`, this.formData)

            console.log(res)

            const {
                meta: {
                    status,
                    msg
                }
            } = res.data
            if (status === 200) {
                // this.loadTableDate()
                this.$message.success(msg)
            }
        }, 
        //修改角色
        async showRolefirm(user) {
            this.dialogFormVisibleEditRole = true
            this.currUsername = user.username
            this.currUserId =user.id

            const res = await this.$http.get('roles')
            // console.log(res)
            this.arrRoles = res.data.data

            //显示当前用户的角色
            const res1 = await this.$http.get(`users/${user.id}`)
            // console.log(res1)

            this.currRoleId = res1.data.data.rid
        },
        async editRole() {
            this.dialogFormVisibleEditRole = false
            const res = await this.$http.put(`users/${this.currUserId}/role`,{
                rid:this.currRoleId
            })
            const {
                meta: {
                    status,
                    msg
                }
            } = res.data
            if (status === 200) {
                // this.loadTableDate()
                this.$message.success(msg)
            }
        }
    },
    mounted() {
        this.loadTableDate()
    }

}
</script>

<style>
.elrow {
    margin-top: 10px
}
</style>
