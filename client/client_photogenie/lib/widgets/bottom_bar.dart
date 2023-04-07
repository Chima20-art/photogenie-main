import 'package:client_photogenie/screens/camera_screen.dart';
import 'package:client_photogenie/screens/gallery_screen.dart';
import 'package:client_photogenie/screens/pick_photo_screen.dart';
import 'package:client_photogenie/screens/profile_screen.dart';
import 'package:flutter/material.dart';

class BottomBar extends StatefulWidget {
  const BottomBar({super.key});

  @override
  State<BottomBar> createState() => _BottomBarState();
}

class _BottomBarState extends State<BottomBar> {
  int _page = 0;

  final List<Widget> _pages = <Widget>[
    const GalleryPage(),
    const CameraScreen(),
    const ImageScreen(),
    const Center(child: Text('Retouch')),
    const ProfilePage(),
  ];

  void updatePage(int page) {
    setState(() {
      _page = page;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _pages[_page],
      bottomNavigationBar: _page != 1
          ? BottomNavigationBar(
              type: BottomNavigationBarType.fixed,
              currentIndex: _page,
              selectedItemColor: const Color(0xffAE2A58),
              unselectedItemColor: const Color(0xffFFFFFE),
              backgroundColor: const Color(0xff0F0E17),
              iconSize: 25,
              onTap: updatePage,
              items: const [
                BottomNavigationBarItem(
                  icon: Icon(Icons.photo_library),
                  label: 'Album',
                ),
                BottomNavigationBarItem(
                  icon: Icon(Icons.camera_alt),
                  label: 'Camera',
                ),
                BottomNavigationBarItem(
                  icon: Icon(Icons.add),
                  label: 'Add Photo',
                ),
                BottomNavigationBarItem(
                  icon: Icon(Icons.face_retouching_natural_outlined),
                  label: 'Retouch',
                ),
                BottomNavigationBarItem(
                  icon: Icon(Icons.portrait_rounded),
                  label: 'Profile',
                ),
              ],
            )
          : const SizedBox(),
    );
  }
}
