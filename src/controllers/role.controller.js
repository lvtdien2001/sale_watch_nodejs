import roleService from '../services/role.service'

import userService from '../services/user.service'

class roleController {
    async updateRole(req, res) {
        try {
            const roles = req.body.roles;
            let data = []
            for (let i = 0; i < roles.length; i++) {
                data.push(
                    {
                        roleId: roles[i]
                    }
                )
            }

            if (roles) {
                const result = await userService.updateRole(req.params.id, data)
                if (result) {
                    res.redirect('/admin/role')
                }
            }
        } catch (error) {
            console.log(error);
        }

    }

    async createRole(req, res) {
        try {
            if (req.body) {
                const result = await roleService.create(req.body)
                if (result)
                    res.redirect('back')
            }
        } catch (error) {
            console.log(error)
        }
    }

    async displayRole(req, res) {
        try {
            const allUser = await userService.findAllUser()
            res.render('admin/role', { users: allUser, layout: 'admin' })

        } catch (error) {
            console.log(error);
        }
    }

    async roleUser(req, res) {
        try {
            const userRoles = await userService.findById(req.params.id)
            const allrole = await roleService.findAll()
            const roles = []
            for (let i = 0; i < userRoles.roles.length; i++) {
                roles.push(userRoles.roles[i].roleId.toObject())
            }
            res.render('admin/role-update', {
                userRoles,
                listRoles: roles,
                layout: 'admin',
                helpers: {
                    templateRole: () => {
                        let inputChecked = ''
                        let inputCheck = ''
                        let temp = []

                        if (roles.length > 0) {
                            for (let i = 0; i < allrole.length; i++) {
                                for (let j = 0; j < roles.length; j++) {
                                    if (allrole[i].name == roles[j].name && !temp.includes(allrole[i].name)) {
                                        inputChecked += `
                                        <div>
                                            <input id="input__role" class="input__role" name="roles[]" type="checkbox" checked/ value="${allrole[i]._id}">
                                            <lable for="input__role">${allrole[i].name}</lable>
                                        </div>
                                        `
                                        temp.push(allrole[i].name)
                                    }
                                }
                            }

                            for (let i = 0; i < temp.length; i++) {
                                for (let j = 0; j < allrole.length; j++) {
                                    if (temp[i] != allrole[j].name) {
                                        inputCheck += `
                                        <div>
                                            <input id="input__role" name="roles[]" class="input__role" type="checkbox" value="${allrole[j]._id}"/>
                                            <lable for="input__role">${allrole[j].name}</lable>
                                        </div>
                                        `
                                    }
                                    else {
                                        i++
                                    }
                                }

                            }
                            // return allrole
                            return inputChecked + inputCheck;
                        } else {
                            for (let k = 0; k < allrole.length; k++) {
                                inputChecked += ` 
                                        <div>
                                            <input id="input__role" name="roles[]" class="input__role" type="checkbox" value="${allrole[k]._id}" />
                                            <lable for="input__role" >${allrole[k].name}</lable>
                                        </div>
                                        `
                            }
                            return inputChecked;
                        }
                    }
                }
            }
            )

        } catch (error) {
            console.log(error);
        }
    }

    async displayCreateRole(req, res) {
        try {
            const roles = await roleService.findAll()
            res.render('admin/role-create', {
                roles,
                layout: 'admin'
            })
        } catch (error) {
            console.log(error);
        }
    }

    async displayRoleEdit(req, res) {
        if (req.params.id) {
            const role = await roleService.findById(req.params.id)
            res.render('admin/role-edit', {
                role,
                layout: 'admin'
            })
        }
    }

    async roleEdit(req, res) {
        try {
            if (req.body) {
                const result = await roleService.updateRole(req.params.id, req.body)
                if (result)
                    res.redirect(req.get('referer'))
            }
        } catch (error) {
            console.log(error);
        }
    }

    async deleteRole(req, res) {
        try {
            if (req.params.id) {
                const result = await roleService.deleteRole(req.params.id)
                if (result) {
                    res.redirect(req.get('referer'))
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new roleController